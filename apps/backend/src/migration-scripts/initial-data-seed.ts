import { MedusaContainer } from "@medusajs/framework"
import type { AuthenticationInput, Logger } from "@medusajs/framework/types"
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  createUsersWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateProductCategoriesWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Initial store data. Every step checks what already exists in PostgreSQL and
 * only creates what is missing, so the script is safe to run again, for
 * example after a partial failure:
 *
 *   cd apps/backend
 *   npx medusa exec ./src/migration-scripts/initial-data-seed.ts
 *
 * Existing regions, users and countries are reused or skipped, never
 * duplicated, which avoids "Countries already assigned to a region".
 *
 * The admin user comes from ADMIN_EMAIL and ADMIN_PASSWORD in
 * apps/backend/.env (git-ignored). Credentials never live in this file.
 */

/** Tunisia is the primary market: region "tn", currency "tnd". */
const PRIMARY_CURRENCY = "tnd"
const TUNISIA_COUNTRIES = ["tn"]
const EUROPE_COUNTRIES = ["gb", "de", "dk", "se", "fr", "es", "it"]

const SALES_CHANNEL_NAME = "Default Sales Channel"
const API_KEY_TITLE = "Default Publishable API Key"
const STOCK_LOCATION_NAME = "Tunis Warehouse"
const FULFILLMENT_SET_NAME = "Tunis Warehouse delivery"
const TUNISIA_ZONE = "Tunisia"
const EUROPE_ZONE = "Europe"

/**
 * Demo prices. The TND amounts are placeholders (roughly 3.5 TND per EUR);
 * set real prices in the Medusa admin.
 */
const getDefaultPrices = () => [
  { amount: 10, currency_code: "eur" },
  { amount: 15, currency_code: "usd" },
  { amount: 35, currency_code: PRIMARY_CURRENCY },
]

/** Placeholder shipping rates in TND. Standard matches the region metadata. */
const TUNISIA_STANDARD_RATE = 8
const TUNISIA_EXPRESS_RATE = 15

const SIZES = ["S", "M", "L", "XL"]
const COLORS = ["Black", "White"]

/**
 * The first four are the featured homepage categories. Their handles must
 * match FEATURED_CATEGORIES in the storefront's featured-categories module.
 */
const CATEGORIES: { name: string; handle?: string; core?: boolean }[] = [
  { name: "Clothing", handle: "clothing", core: true },
  { name: "Sports & Nutrition", handle: "sports-nutrition", core: true },
  { name: "Lifestyle & Home", handle: "lifestyle-home", core: true },
  { name: "Electronics & Gadgets", handle: "electronics-gadgets", core: true },
  { name: "Shirts" },
  { name: "Sweatshirts" },
  { name: "Pants" },
  { name: "Merch" },
]

const buildGeoZones = (countries: string[]) =>
  countries.map((country_code) => ({
    country_code,
    type: "country" as const,
  }))

const buildSizeVariants = (skuPrefix: string) =>
  SIZES.map((size) => ({
    title: size,
    sku: `${skuPrefix}-${size}`,
    options: { Size: size },
    prices: getDefaultPrices(),
  }))

const buildShirtVariants = () =>
  SIZES.flatMap((size) =>
    COLORS.map((color) => ({
      title: `${size} / ${color}`,
      sku: `SHIRT-${size}-${color.toUpperCase()}`,
      options: { Size: size, Color: color },
      prices: getDefaultPrices(),
    }))
  )

const getShippingRules = () => [
  {
    attribute: "enabled_in_store",
    value: "true",
    operator: "eq" as const,
  },
  {
    attribute: "is_return",
    value: "false",
    operator: "eq" as const,
  },
]

/**
 * Creates the admin user from ADMIN_EMAIL and ADMIN_PASSWORD, the same way
 * `medusa user` does. Skips when either variable is unset or the user exists.
 * Neither value is ever logged.
 */
async function ensureAdminUser(container: MedusaContainer, logger: Logger) {
  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    logger.info(
      "ADMIN_EMAIL or ADMIN_PASSWORD is not set, skipping admin user. Set both in apps/backend/.env or run `npx medusa user`."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existingUsers } = await query.graph({
    entity: "user",
    fields: ["id"],
    filters: { email },
  })

  if (existingUsers.length) {
    logger.info("Admin user already exists, skipping.")
    return
  }

  const authService = container.resolve(Modules.AUTH)

  const {
    result: [user],
  } = await createUsersWorkflow(container).run({
    input: { users: [{ email }] },
  })

  const { authIdentity, error } = await authService.register("emailpass", {
    body: { email, password },
  } as AuthenticationInput)

  if (error || !authIdentity) {
    logger.error(
      `Admin user record was created but its login could not be registered (${
        error ?? "no auth identity returned"
      }). Delete the user in the admin, or run \`npx medusa user\`.`
    )
    return
  }

  await authService.updateAuthIdentities({
    id: authIdentity.id,
    app_metadata: { user_id: user.id },
  })

  logger.info("Admin user created.")
}

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Seeding store data...")

  // ---- Sales channel and publishable API key -------------------------------

  const { data: existingChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
    filters: { name: SALES_CHANNEL_NAME },
  })

  let salesChannelId: string

  if (existingChannels.length) {
    salesChannelId = existingChannels[0].id
    logger.info("Sales channel already exists, skipping.")
  } else {
    const {
      result: [createdChannel],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: SALES_CHANNEL_NAME,
            description: "Created by Medusa",
          },
        ],
      },
    })
    salesChannelId = createdChannel.id
  }

  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable", title: API_KEY_TITLE },
  })

  if (existingKeys.length) {
    logger.info("Publishable API key already exists, skipping.")
  } else {
    const {
      result: [publishableApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: API_KEY_TITLE,
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [salesChannelId],
      },
    })
  }

  // ---- Store: TND is the default currency ----------------------------------

  const { data: existingStores } = await query.graph({
    entity: "store",
    fields: [
      "id",
      "default_sales_channel_id",
      "supported_currencies.currency_code",
    ],
  })

  const existingStore = existingStores[0]
  const currencyCodes = Array.from(
    new Set([
      PRIMARY_CURRENCY,
      "eur",
      "usd",
      ...(existingStore?.supported_currencies ?? [])
        .map((currency) => currency?.currency_code)
        .filter((code): code is string => Boolean(code)),
    ])
  )
  const supportedCurrencies = currencyCodes.map((currency_code) => ({
    currency_code,
    is_default: currency_code === PRIMARY_CURRENCY,
  }))

  if (existingStore) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: existingStore.id },
        update: {
          supported_currencies: supportedCurrencies,
          ...(existingStore.default_sales_channel_id
            ? {}
            : { default_sales_channel_id: salesChannelId }),
        },
      },
    })
    logger.info("Store already exists, set TND as the default currency.")
  } else {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Default Store",
            supported_currencies: supportedCurrencies,
            default_sales_channel_id: salesChannelId,
          },
        ],
      },
    })
  }

  // ---- Regions --------------------------------------------------------------

  logger.info("Seeding region data...")

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  const assignedCountries = new Set<string>(
    existingRegions.flatMap((region) =>
      (region.countries ?? [])
        .map((country) => country?.iso_2?.toLowerCase())
        .filter((code): code is string => Boolean(code))
    )
  )

  const ensureRegion = async ({
    name,
    currency_code,
    countries,
    metadata,
    reuseByCountry,
  }: {
    name: string
    currency_code: string
    countries: string[]
    metadata: Record<string, unknown>
    /** Reuse any region that already holds one of the countries. */
    reuseByCountry: boolean
  }): Promise<string | null> => {
    const existing =
      existingRegions.find((region) => region.name === name) ??
      (reuseByCountry
        ? existingRegions.find((region) =>
            (region.countries ?? []).some((country) =>
              countries.includes(country?.iso_2?.toLowerCase() ?? "")
            )
          )
        : undefined)

    if (existing) {
      logger.info(`Region "${existing.name}" already exists, skipping.`)
      if (existing.currency_code !== currency_code) {
        logger.warn(
          `Region "${existing.name}" uses ${existing.currency_code}, not ${currency_code}. Left unchanged because it may have carts or orders.`
        )
      }
      return existing.id
    }

    const free = countries.filter((code) => !assignedCountries.has(code))
    const taken = countries.filter((code) => assignedCountries.has(code))

    if (taken.length) {
      logger.warn(
        `Countries already assigned to another region, left out of "${name}": ${taken.join(", ")}`
      )
    }

    if (!free.length) {
      logger.warn(`No unassigned countries left for "${name}", skipping.`)
      return null
    }

    const {
      result: [region],
    } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name,
            currency_code,
            countries: free,
            payment_providers: ["pp_system_default"],
            metadata,
          },
        ],
      },
    })

    free.forEach((code) => assignedCountries.add(code))
    return region.id
  }

  const tunisiaRegionId = await ensureRegion({
    name: "Tunisia",
    currency_code: PRIMARY_CURRENCY,
    countries: TUNISIA_COUNTRIES,
    metadata: {
      ...DEFAULT_REGION_STORE_POLICIES,
      shipping_rate: TUNISIA_STANDARD_RATE,
    },
    reuseByCountry: true,
  })

  if (!tunisiaRegionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Could not create or find the Tunisia region."
    )
  }

  const europeRegionId = await ensureRegion({
    name: "Europe",
    currency_code: "eur",
    countries: EUROPE_COUNTRIES,
    metadata: DEFAULT_REGION_STORE_POLICIES,
    reuseByCountry: false,
  })
  logger.info("Finished seeding regions.")

  // ---- Tax regions ------------------------------------------------------------

  logger.info("Seeding tax regions...")
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["country_code"],
  })
  const taxedCountries = new Set<string>(
    existingTaxRegions
      .map((taxRegion) => taxRegion.country_code?.toLowerCase())
      .filter((code): code is string => Boolean(code))
  )
  const missingTaxCountries = [...TUNISIA_COUNTRIES, ...EUROPE_COUNTRIES].filter(
    (code) => !taxedCountries.has(code)
  )

  if (missingTaxCountries.length) {
    await createTaxRegionsWorkflow(container).run({
      input: missingTaxCountries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    })
  }
  logger.info("Finished seeding tax regions.")

  // ---- Stock location ---------------------------------------------------------

  logger.info("Seeding stock location data...")

  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
    filters: { name: STOCK_LOCATION_NAME },
  })

  let stockLocationId: string

  if (existingLocations.length) {
    stockLocationId = existingLocations[0].id
    logger.info("Stock location already exists, skipping.")
  } else {
    const {
      result: [createdLocation],
    } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: STOCK_LOCATION_NAME,
            address: {
              city: "Tunis",
              country_code: "TN",
              address_1: "",
            },
          },
        ],
      },
    })
    stockLocationId = createdLocation.id

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocationId,
        add: [salesChannelId],
      },
    })
  }

  // ---- Fulfillment ------------------------------------------------------------

  logger.info("Seeding fulfillment data...")

  // This is created by a migration script in core.
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No shipping profile found. Run `medusa db:migrate` first."
    )
  }

  // Service zone names are unique across ALL fulfillment sets, not just within
  // one. An earlier run, or the original starter seed, may already have created
  // "Europe" inside a different set, and creating it again throws "Service zone
  // with name: Europe, already exists". So look the zones up globally by name,
  // reuse whatever exists, and create only the zones that are missing.
  const zoneSeeds = [
    { name: TUNISIA_ZONE, countries: TUNISIA_COUNTRIES },
    { name: EUROPE_ZONE, countries: EUROPE_COUNTRIES },
  ]

  const findZoneIdsByName = async () => {
    const zones = await fulfillmentModuleService.listServiceZones({
      name: zoneSeeds.map((zone) => zone.name),
    })
    return new Map<string, string>(zones.map((zone) => [zone.name, zone.id]))
  }

  const zoneIds = await findZoneIdsByName()

  const { data: existingSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id"],
    filters: { name: FULFILLMENT_SET_NAME },
  })

  let fulfillmentSetId: string

  if (existingSets.length) {
    fulfillmentSetId = existingSets[0].id
    logger.info("Fulfillment set already exists, reusing it.")
  } else {
    // Created empty on purpose: zones are added one by one below, and only the
    // ones that do not exist yet. Putting a zone that already exists in this
    // call is what throws "Service zone with name: Europe, already exists".
    const createdSet = await fulfillmentModuleService.createFulfillmentSets({
      name: FULFILLMENT_SET_NAME,
      type: "shipping",
    })
    fulfillmentSetId = createdSet.id
  }

  // Link the set to the Tunis stock location, but only when that link is
  // missing, so a run that stopped half way can be repeated.
  const {
    data: [stockLocation],
  } = await query.graph({
    entity: "stock_location",
    fields: ["id", "fulfillment_sets.id"],
    filters: { id: stockLocationId },
  })
  const setIsLinked = (stockLocation?.fulfillment_sets ?? []).some(
    (set) => set?.id === fulfillmentSetId
  )

  if (!setIsLinked) {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetId,
      },
    })
  }

  const ensureZone = async (zone: { name: string; countries: string[] }) => {
    if (zoneIds.has(zone.name)) {
      logger.info(`Service zone "${zone.name}" already exists, reusing it.`)
      return
    }

    try {
      const createdZone = await fulfillmentModuleService.createServiceZones({
        name: zone.name,
        fulfillment_set_id: fulfillmentSetId,
        geo_zones: buildGeoZones(zone.countries),
      })
      zoneIds.set(zone.name, createdZone.id)
    } catch (error) {
      // The zone may have appeared since the lookup. Read again and reuse it;
      // if it is still missing, the failure is something else, so rethrow.
      const refreshed = await findZoneIdsByName()
      const existingId = refreshed.get(zone.name)

      if (!existingId) {
        throw error
      }

      zoneIds.set(zone.name, existingId)
      logger.warn(`Service zone "${zone.name}" already existed, reusing it.`)
    }
  }

  for (const zone of zoneSeeds) {
    await ensureZone(zone)
  }

  const tunisiaZoneId = zoneIds.get(TUNISIA_ZONE)!
  const europeZoneId = zoneIds.get(EUROPE_ZONE)!

  type ShippingOptionSeed = {
    name: string
    zoneId: string
    label: string
    description: string
    code: string
    prices: (
      | { currency_code: string; amount: number }
      | { region_id: string; amount: number }
    )[]
  }

  const shippingOptionSeeds: ShippingOptionSeed[] = [
    {
      name: "Standard Shipping",
      zoneId: tunisiaZoneId,
      label: "Standard",
      description: "Ship in 2-3 days.",
      code: "standard",
      prices: [
        { currency_code: PRIMARY_CURRENCY, amount: TUNISIA_STANDARD_RATE },
        { region_id: tunisiaRegionId, amount: TUNISIA_STANDARD_RATE },
      ],
    },
    {
      name: "Express Shipping",
      zoneId: tunisiaZoneId,
      label: "Express",
      description: "Ship in 24 hours.",
      code: "express",
      prices: [
        { currency_code: PRIMARY_CURRENCY, amount: TUNISIA_EXPRESS_RATE },
        { region_id: tunisiaRegionId, amount: TUNISIA_EXPRESS_RATE },
      ],
    },
  ]

  if (europeRegionId) {
    const europePrices = [
      { currency_code: "usd", amount: 10 },
      { currency_code: "eur", amount: 10 },
      { region_id: europeRegionId, amount: 10 },
    ]

    shippingOptionSeeds.push(
      {
        name: "Standard Shipping",
        zoneId: europeZoneId,
        label: "Standard",
        description: "Ship in 2-3 days.",
        code: "standard",
        prices: europePrices,
      },
      {
        name: "Express Shipping",
        zoneId: europeZoneId,
        label: "Express",
        description: "Ship in 24 hours.",
        code: "express",
        prices: europePrices,
      }
    )
  } else {
    logger.warn("No Europe region, skipping Europe shipping options.")
  }

  const { data: existingShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["name", "service_zone_id"],
    filters: { service_zone_id: [tunisiaZoneId, europeZoneId] },
  })

  const missingShippingOptions = shippingOptionSeeds.filter(
    (seed) =>
      !existingShippingOptions.some(
        (option) =>
          option.name === seed.name && option.service_zone_id === seed.zoneId
      )
  )

  if (missingShippingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: missingShippingOptions.map((seed) => ({
        name: seed.name,
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: seed.zoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: seed.label,
          description: seed.description,
          code: seed.code,
        },
        prices: seed.prices.map((price) => ({ ...price })),
        rules: getShippingRules(),
      })),
    })
  } else {
    logger.info("Shipping options already exist, skipping.")
  }
  logger.info("Finished seeding fulfillment data.")
  logger.info("Finished seeding stock location data.")

  // ---- Categories -------------------------------------------------------------

  logger.info("Seeding product data...")

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "is_active"],
  })

  const categoryIds = new Map<string, string>()
  const missingCategories: typeof CATEGORIES = []
  const inactiveCoreIds: string[] = []

  for (const category of CATEGORIES) {
    const match = existingCategories.find(
      (existing) =>
        existing.name === category.name ||
        (category.handle !== undefined && existing.handle === category.handle)
    )

    if (!match) {
      missingCategories.push(category)
      continue
    }

    categoryIds.set(category.name, match.id)

    if (category.core && match.is_active === false) {
      inactiveCoreIds.push(match.id)
    }
  }

  if (missingCategories.length) {
    const { result: createdCategories } =
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: missingCategories.map((category) => ({
            name: category.name,
            ...(category.handle ? { handle: category.handle } : {}),
            is_active: true,
          })),
        },
      })

    for (const created of createdCategories) {
      categoryIds.set(created.name, created.id)
    }
    logger.info(`Created ${createdCategories.length} categories.`)
  }

  for (const id of inactiveCoreIds) {
    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id },
        update: { is_active: true },
      },
    })
  }

  // ---- Product options --------------------------------------------------------

  const { data: existingOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
    filters: { is_exclusive: false },
  })

  const optionSeeds = [
    { title: "Size", values: SIZES },
    { title: "Color", values: COLORS },
  ]
  const missingOptions = optionSeeds.filter(
    (seed) => !existingOptions.some((option) => option.title === seed.title)
  )

  const optionIds = new Map<string, string>(
    existingOptions.map((option) => [option.title as string, option.id])
  )

  if (missingOptions.length) {
    const { result: createdOptions } = await createProductOptionsWorkflow(
      container
    ).run({
      input: { product_options: missingOptions },
    })

    for (const created of createdOptions) {
      optionIds.set(created.title, created.id)
    }
  }

  const sizeOptionId = optionIds.get("Size")!
  const colorOptionId = optionIds.get("Color")!

  // ---- Products ---------------------------------------------------------------

  const categoryId = (name: string) => categoryIds.get(name)!

  const productSeeds = [
    {
      title: "Medusa T-Shirt",
      category_ids: [categoryId("Clothing"), categoryId("Shirts")],
      description:
        "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
      handle: "t-shirt",
      weight: 400,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
        },
      ],
      options: [{ id: sizeOptionId }, { id: colorOptionId }],
      variants: buildShirtVariants(),
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Medusa Sweatshirt",
      category_ids: [categoryId("Clothing"), categoryId("Sweatshirts")],
      description:
        "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
      handle: "sweatshirt",
      weight: 400,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
        },
      ],
      options: [{ id: sizeOptionId }],
      variants: buildSizeVariants("SWEATSHIRT"),
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Medusa Sweatpants",
      category_ids: [categoryId("Clothing"), categoryId("Pants")],
      description:
        "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
      handle: "sweatpants",
      weight: 400,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
        },
      ],
      options: [{ id: sizeOptionId }],
      variants: buildSizeVariants("SWEATPANTS"),
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "Medusa Shorts",
      category_ids: [categoryId("Clothing"), categoryId("Merch")],
      description:
        "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
      handle: "shorts",
      weight: 400,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
        },
        {
          url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
        },
      ],
      options: [{ id: sizeOptionId }],
      variants: buildSizeVariants("SHORTS"),
      sales_channels: [{ id: salesChannelId }],
    },
  ]

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["handle"],
    filters: { handle: productSeeds.map((seed) => seed.handle) },
  })
  const existingHandles = new Set(
    existingProducts.map((product) => product.handle)
  )
  const missingProducts = productSeeds.filter(
    (seed) => !existingHandles.has(seed.handle)
  )

  if (missingProducts.length) {
    await createProductsWorkflow(container).run({
      input: { products: missingProducts },
    })
    logger.info(`Created ${missingProducts.length} products.`)
  } else {
    logger.info("Seed products already exist, skipping.")
  }
  logger.info("Finished seeding product data.")

  // ---- Inventory --------------------------------------------------------------

  logger.info("Seeding inventory levels.")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
    filters: { location_id: stockLocationId },
  })
  const stockedItemIds = new Set(
    existingLevels.map((level) => level.inventory_item_id)
  )
  const unstockedItems = inventoryItems.filter(
    (item) => !stockedItemIds.has(item.id)
  )

  if (unstockedItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: unstockedItems.map((item) => ({
          location_id: stockLocationId,
          stocked_quantity: 1000000,
          inventory_item_id: item.id,
        })),
      },
    })
  }

  logger.info("Finished seeding inventory levels data.")

  // ---- Admin user -------------------------------------------------------------

  await ensureAdminUser(container, logger)
}
