import {
  INPUT_STRATEGY_COMPOSITE,
  INPUT_STRATEGY_DEGRADE,
  INPUT_STRATEGY_SVG_TRANSFORM,
} from '../constant.js'

export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://iconduit.github.io/schema/config.schema.json',
  title: 'Iconduit configuration',
  description: 'The configuration for an Iconduit build process',
  type: 'object',
  additionalProperties: false,
  properties: {
    applications: {
      description: 'Defines related applications',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        native: {
          description: 'Defines related native applications',
          type: 'array',
          default: [],
          items: {
            description: 'A related native application',
            type: 'object',
            additionalProperties: false,
            required: ['platform'],
            anyOf: [
              {
                required: ['id'],
              },
              {
                required: ['url'],
              },
            ],
            properties: {
              country: {
                description: 'The country of the app store in which the native application is available',
                type: 'string',
                default: 'US',
              },
              fingerprints: {
                description: 'A set of cryptographic fingerprints used for verifying the native application',
                type: 'array',
                default: [],
                items: {
                  description: 'A cryptographic fingerprint used for verifying the native application',
                  type: 'object',
                  additionalProperties: false,
                  required: ['type', 'value'],
                  properties: {
                    type: {
                      description: 'The fingerprint type',
                      type: 'string',
                      minLength: 1,
                    },
                    value: {
                      description: 'The fingerprint value',
                      type: 'string',
                      minLength: 1,
                    },
                  },
                },
              },
              id: {
                description: 'The identifier used to uniquely identify the native application within its platform',
                type: 'string',
                minLength: 1,
              },
              launchUrl: {
                description:
                  'A URL associated with the native application that can be used to launch it in a particular state',
                type: 'string',
                format: 'uri-reference',
              },
              minVersion: {
                description:
                  'The minimum version of the native application that is considered related to the application',
                type: 'string',
                minLength: 1,
              },
              platform: {
                description: 'The software platform on which the native application runs',
                type: 'string',
                minLength: 1,
                examples: ['chrome_web_store', 'itunes', 'play', 'windows'],
              },
              url: {
                description: 'A URL where the native application is available for installation and/or purchase',
                type: 'string',
                format: 'uri-reference',
              },
            },
          },
        },
        preferNative: {
          description: 'A hint to suggest whether native applications should be preferred over the application',
          type: 'boolean',
          default: false,
        },
        web: {
          description: 'Additional settings related to web application integration',
          type: 'object',
          default: {},
          additionalProperties: false,
          properties: {
            facebook: {
              description: 'Additional settings related to Facebook integration',
              type: 'object',
              default: {},
              additionalProperties: false,
              properties: {
                appId: {
                  description: 'The Facebook App ID',
                  type: 'string',
                  minLength: 1,
                },
              },
            },
            twitter: {
              description: 'Additional settings related to Twitter integration',
              type: 'object',
              default: {},
              additionalProperties: false,
              properties: {
                cardType: {
                  description: 'The type of Twitter card that should appear when the application is shared',
                  type: 'string',
                  default: 'summary_large_image',
                  enum: ['app', 'player', 'summary', 'summary_large_image'],
                },
                creatorHandle: {
                  description: 'The Twitter handle of the application creator',
                  type: 'string',
                  minLength: 1,
                },
                siteHandle: {
                  description: 'The Twitter handle of the application',
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
    categories: {
      description: 'The categories to which the application belongs',
      type: 'array',
      default: [],
      items: {
        description: 'A category to which the application belongs',
        type: 'string',
        minLength: 1,
        examples: [
          'books',
          'business',
          'education',
          'entertainment',
          'finance',
          'fitness',
          'food',
          'games',
          'government',
          'health',
          'kids',
          'lifestyle',
          'magazines',
          'medical',
          'music',
          'navigation',
          'news',
          'personalization',
          'photo',
          'politics',
          'productivity',
          'security',
          'shopping',
          'social',
          'sports',
          'travel',
          'utilities',
          'weather',
        ],
      },
    },
    colors: {
      description: 'Defines which colors should be used of each color type',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        background: {
          description: 'The background color, used in splash screens, and as a substitute for background images',
          type: 'string',
          minLength: 1,
        },
        brand: {
          description: 'The primary color of the application, used as a default for all other color types',
          type: 'string',
          default: 'gray',
          minLength: 1,
        },
        mask: {
          description: 'The mask color, used to colorize mask icons',
          type: 'string',
          minLength: 1,
        },
        theme: {
          description: 'The theme color, used primarily to color the UI elements surrounding the application',
          type: 'string',
          minLength: 1,
        },
        tile: {
          description: 'The tile color, used as the background color of tile icons',
          type: 'string',
          minLength: 1,
        },
      },
    },
    definitions: {
      description: 'Contains definitions relating to the inputs and outputs to be produced',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        color: {
          description: 'Custom reusable named color definitions',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/colorName'},
          additionalProperties: {
            description: 'A CSS color definition',
            type: 'string',
            minLength: 1,
            examples: ['hsla(127, 127, 127, 0.5)'],
          },
        },
        device: {
          description: 'Definitions of devices to be targeted',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/deviceName'},
          additionalProperties: {
            description: 'Defines a device to be targeted',
            type: 'object',
            additionalProperties: false,
            required: ['display', 'name'],
            properties: {
              display: {$ref: '#/definitions/displayName'},
              name: {
                description: 'The user-friendly name of the device',
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
        display: {
          description: 'Definitions of displays to be targeted',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/displayName'},
          additionalProperties: {
            description: 'Defines a display to be targeted',
            type: 'object',
            additionalProperties: false,
            required: ['resolution'],
            properties: {
              orientation: {
                description: 'The default orientation of the display',
                type: 'string',
                enum: ['landscape', 'portrait'],
              },
              pixelDensity: {
                description: 'The pixel density of the display in pixels-per-inch',
                type: 'integer',
                default: 72,
                minimum: 1,
              },
              pixelRatio: {
                description: 'The pixel ratio as reported to the user agent',
                type: 'integer',
                default: 1,
                minimum: 1,
              },
              resolution: {
                description: 'The device resolution as reported to the user agent',
                type: 'object',
                additionalProperties: false,
                required: ['horizontal', 'vertical'],
                properties: {
                  horizontal: {
                    description: 'The horizontal device resolution as reported to the user agent',
                    type: 'integer',
                    minimum: 1,
                  },
                  vertical: {
                    description: 'The vertical device resolution as reported to the user agent',
                    type: 'integer',
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        input: {
          description: 'Definitions of inputs to be found or produced',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/inputName'},
          additionalProperties: {
            description: 'Defines how an input should be found or produced',
            type: 'object',
            required: ['options', 'strategy'],
            oneOf: [
              {
                additionalProperties: false,
                properties: {
                  options: {
                    description: 'The options to use when producing the composite input',
                    type: 'object',
                    additionalProperties: false,
                    required: ['layers'],
                    properties: {
                      isMasked: {
                        description: 'Whether the input should have a mask applied',
                        type: 'boolean',
                        // default: false,
                      },
                      layers: {
                        description: 'The layers to compose together into an input',
                        type: 'array',
                        items: {
                          description: 'A layer that forms part of a composite input',
                          type: 'object',
                          additionalProperties: false,
                          required: ['input'],
                          properties: {
                            input: {$ref: '#/definitions/inputName'},
                            style: {$ref: '#/definitions/styleName'},
                          },
                        },
                      },
                    },
                  },
                  strategy: {
                    description: 'The strategy used to find or produce the input',
                    const: INPUT_STRATEGY_COMPOSITE,
                  },
                },
              },
              {
                additionalProperties: false,
                properties: {
                  options: {
                    description: 'The options for finding the input to degrade to',
                    type: 'object',
                    additionalProperties: false,
                    required: ['to'],
                    properties: {
                      to: {$ref: '#/definitions/inputName'},
                    },
                  },
                  strategy: {
                    description: 'The strategy used to find or produce the input',
                    const: INPUT_STRATEGY_DEGRADE,
                  },
                },
              },
              {
                properties: {
                  options: {
                    description: 'The options to use when performing the SVG transformation',
                    type: 'object',
                    additionalProperties: false,
                    required: ['input'],
                    properties: {
                      input: {$ref: '#/definitions/inputName'},
                      maskColor: {$ref: '#/definitions/colorName'},
                      style: {$ref: '#/definitions/styleName'},
                    },
                  },
                  strategy: {
                    description: 'The strategy used to find or produce the input',
                    const: INPUT_STRATEGY_SVG_TRANSFORM,
                  },
                },
              },
            ],
          },
        },
        output: {
          description: 'Definitions of outputs to be produced',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/outputName'},
          additionalProperties: {
            description: 'Defines how an output should be produced',
            type: 'object',
            additionalProperties: false,
            required: ['name'],
            properties: {
              input: {$ref: '#/definitions/inputName'},
              name: {
                description: 'A file name template',
                type: 'string',
                minLength: 1,
              },
              options: {
                description: 'Options that affect how an output is produced',
                type: 'object',
                default: {},
                additionalProperties: false,
                properties: {
                  isMasked: {
                    description: 'Whether the output should have a mask applied',
                    type: 'boolean',
                    default: false,
                  },
                  isTransparent: {
                    description: 'Whether the output supports transparency',
                    type: 'boolean',
                    default: true,
                  },
                  variables: {
                    description: 'Additional template variables to pass to templated outputs',
                    type: 'object',
                    default: {},
                  },
                },
              },
              sizes: {
                description: 'A list of sizes to use when producing the output',
                type: 'array',
                default: [],
                items: {$ref: '#/definitions/sizeName'},
              },
              tags: {
                description: 'A list of tags associated with the output',
                type: 'array',
                default: [],
                items: {$ref: '#/definitions/tagName'},
              },
            },
          },
        },
        size: {
          description: 'Definitions of output sizes',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/sizeName'},
          additionalProperties: {
            description: 'Defines the size of an output',
            type: 'object',
            additionalProperties: false,
            required: ['width', 'height'],
            properties: {
              deviceHeight: {
                description: 'The device height of the associated device',
                type: 'integer',
                minimum: 1,
              },
              deviceWidth: {
                description: 'The device width of the associated device',
                type: 'integer',
                minimum: 1,
              },
              height: {
                description: 'The height of the size',
                type: 'number',
                minimum: 1,
              },
              key: {
                description: 'A short string that can be used to access outputs produced at this size',
                type: 'string',
                minLength: 1,
              },
              orientation: {
                description: 'The orientation of the size',
                type: 'string',
                enum: ['landscape', 'portrait'],
              },
              pixelDensity: {
                description: 'The pixel density of the size',
                type: 'integer',
                default: 72,
                minimum: 1,
              },
              pixelRatio: {
                description: 'The pixel ratio of the size',
                type: 'integer',
                default: 1,
                minimum: 1,
              },
              width: {
                description: 'The width of the size',
                type: 'number',
                minimum: 1,
              },
            },
          },
        },
        style: {
          description: 'Definitions of styles to apply when producing outputs',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/styleName'},
          additionalProperties: {
            description: 'A set of CSS declarations',
            type: 'object',
            propertyNames: {
              description: 'A CSS property',
              type: 'string',
              minLength: 1,
            },
            additionalProperties: {
              description: 'A CSS value',
              type: 'string',
              minLength: 1,
            },
          },
        },
        tag: {
          description: 'Definitions of tags to be produced',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/tagName'},
          additionalProperties: {
            description: 'Defines a related set of tags to be produced',
            type: 'object',
            propertyNames: {
              description: 'The section of the document where the tags should be placed',
              type: 'string',
              minLength: 1,
            },
            additionalProperties: {$ref: '#/definitions/tagDefinitionList'},
          },
        },
        target: {
          description: 'Defines which outputs and tags are used by each target platform',
          type: 'object',
          default: {},
          additionalProperties: false,
          properties: {
            all: {
              $ref: '#/definitions/targetOutputs',
              default: {},
            },
            browser: {
              $ref: '#/definitions/targetOutputsByTarget',
              default: {},
            },
            installer: {
              $ref: '#/definitions/targetOutputsByTarget',
              default: {},
            },
            os: {
              $ref: '#/definitions/targetOutputsByTarget',
              default: {},
            },
            web: {
              $ref: '#/definitions/targetOutputsByTarget',
              default: {},
            },
          },
        },
      },
    },
    description: {
      description: 'A description of the purpose of the application',
      type: 'string',
      minLength: 1,
    },
    determiner: {
      description: "The word that appears before the application's name in a sentence",
      type: 'string',
      default: '',
      enum: ['', 'a', 'an', 'auto', 'the'],
    },
    displayMode: {
      description: 'The display mode to use when installed as a web app',
      type: 'string',
      default: 'standalone',
      enum: ['browser', 'fullscreen', 'minimal-ui', 'standalone'],
    },
    extra: {
      description: 'Extra configuration to be passed along in the manifest',
      type: 'object',
      default: {},
    },
    iarcRatingId: {
      description: 'The International Age Rating Coalition (IARC) certification code of the application',
      type: 'string',
      minLength: 1,
    },
    inputs: {
      description: 'Defines the paths / module IDs to use when looking for inputs',
      type: 'object',
      default: {},
      propertyNames: {$ref: '#/definitions/inputName'},
      additionalProperties: {
        description: 'A path, or module ID that can be used to locate the input file',
        type: 'string',
        minLength: 1,
      },
    },
    language: {
      description: 'The primary language of the application',
      type: 'string',
      default: 'en-US',
      minLength: 1,
    },
    masks: {
      description: 'Defines which mask should be used for each output',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        primary: {
          description: 'The input to use as a mask when no specific mask has been configured for an output',
          type: 'string',
          default: 'iconMask',
          minLength: 1,
        },
        output: {
          description: 'Defines which mask to use for specific outputs',
          type: 'object',
          default: {},
          propertyNames: {$ref: '#/definitions/outputName'},
          additionalProperties: {$ref: '#/definitions/inputName'},
        },
      },
    },
    name: {
      description: 'The name of the application as it is usually displayed to the user',
      type: 'string',
      default: 'App',
      minLength: 1,
    },
    orientation: {
      description: 'The default orientation of the application',
      type: 'string',
      default: 'any',
      enum: [
        'any',
        'landscape',
        'landscape-primary',
        'landscape-secondary',
        'natural',
        'portrait',
        'portrait-primary',
        'portrait-secondary',
      ],
    },
    os: {
      description: 'Settings that are specific to particular operating systems',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        ios: {
          description: 'Settings that are specific to iOS',
          type: 'object',
          default: {},
          additionalProperties: false,
          properties: {
            statusBarStyle: {
              description: 'The status bar style to use when installed as an app on iOS',
              type: 'string',
              default: 'default',
              enum: ['black', 'black-translucent', 'default'],
            },
          },
        },
      },
    },
    outputPath: {
      description: 'A path to the directory where outputs should be produced',
      type: 'string',
      default: 'dist',
      minLength: 1,
    },
    outputs: {
      description: 'Defines explicit lists of outputs to include and exclude',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        exclude: {
          $ref: '#/definitions/outputSet',
          default: [],
        },
        include: {
          $ref: '#/definitions/outputSet',
          default: [],
        },
      },
    },
    shortName: {
      description: 'A short version of the application name intended for use when space is limited',
      type: 'string',
      minLength: 1,
    },
    tags: {
      description: 'Defines explicit lists of tags to include and exclude',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        exclude: {
          $ref: '#/definitions/tagSet',
          default: [],
        },
        include: {
          $ref: '#/definitions/tagSet',
          default: [],
        },
      },
    },
    targets: {
      description: 'Defines which platforms to target when automatically selecting outputs to be produced',
      type: 'object',
      default: {},
      additionalProperties: false,
      properties: {
        browser: {
          description: 'A set of Browserslist queries used when selecting browsers to target',
          type: 'array',
          default: ['defaults'],
        },
        installer: {
          description: 'A set of installers to target',
          type: 'array',
          default: ['dmg'],
        },
        os: {
          description: 'A set of operating systems to target',
          type: 'array',
          default: ['ios', 'macos', 'windows'],
        },
        web: {
          description: 'A set of web platforms to target',
          type: 'array',
          default: ['facebook', 'github', 'pinterest', 'reddit', 'twitter'],
        },
      },
    },
    textDirection: {
      description: 'The primary text direction of the application',
      type: 'string',
      default: 'auto',
      enum: ['auto', 'ltr', 'rtl'],
    },
    urls: {
      description: 'Defines the output URL structure',
      type: 'object',
      additionalProperties: false,
      properties: {
        base: {
          description: 'The base URL against which all others are resolved',
          type: 'string',
          format: 'uri',
        },
        output: {
          description: 'The URL where output assets will be served from',
          type: 'string',
          default: '.',
          format: 'uri-reference',
        },
        scope: {
          description: 'The top-most URL managed by the application',
          type: 'string',
          default: '.',
          format: 'uri-reference',
        },
        start: {
          description: 'The URL that should be used when the application is launched',
          type: 'string',
          default: '.',
          format: 'uri-reference',
        },
      },
    },
    viewport: {
      description: 'Defines the viewport settings for the application',
      type: 'string',
      default: 'width=device-width, initial-scale=1',
      minLength: 1,
    },
  },
  definitions: {
    colorName: {
      description: 'A custom color name, akin to CSS named colors',
      type: 'string',
      minLength: 1,
      examples: ['mycustomcolor'],
    },
    deviceName: {
      description: 'The name of a device',
      type: 'string',
      minLength: 1,
    },
    displayName: {
      description: 'The name of a display',
      type: 'string',
      minLength: 1,
    },
    inputName: {
      description: 'The name of an input',
      type: 'string',
      minLength: 1,
    },
    outputName: {
      description: 'The name of an output',
      type: 'string',
      minLength: 1,
    },
    outputSet: {
      description: 'A set of output names',
      type: 'array',
      uniqueItems: true,
      items: {$ref: '#/definitions/outputName'},
    },
    sizeName: {
      description: 'The name of a size',
      type: 'string',
      minLength: 1,
    },
    styleName: {
      description: 'The name of a style',
      type: 'string',
      minLength: 1,
    },
    tagDefinition: {
      description: 'Defines how a tag should be produced',
      type: 'object',
      additionalProperties: false,
      required: ['tag'],
      properties: {
        attributes: {
          description: 'A set of HTML attributes',
          type: 'object',
          default: {},
          propertyNames: {
            description: 'An HTML attribute name',
            type: 'string',
            minLength: 1,
          },
          additionalProperties: {$ref: '#/definitions/tagValue'},
        },
        children: {
          $ref: '#/definitions/tagDefinitionList',
          default: [],
        },
        isSelfClosing: {
          description: 'Whether the tag should be rendered as self-closing',
          type: 'boolean',
        },
        predicate: {
          description: 'A list of tag values that will prevent the tag from being produced if they are falsy',
          type: 'array',
          default: [],
          items: {$ref: '#/definitions/tagValue'},
        },
        sortWeight: {
          description: 'A value that can be used to affect the sorting of the tag within its section',
          type: 'integer',
          default: 0,
        },
        tag: {
          description: 'The HTML tag name',
          type: 'string',
          minLength: 1,
        },
      },
    },
    tagDefinitionList: {
      description: 'An ordered list of tag definitions',
      type: 'array',
      items: {$ref: '#/definitions/tagDefinition'},
    },
    tagName: {
      description: 'The name of an tag',
      type: 'string',
      minLength: 1,
    },
    tagSet: {
      description: 'A set of tag names',
      type: 'array',
      uniqueItems: true,
      items: {$ref: '#/definitions/tagName'},
    },
    tagValue: {
      description: 'A value used in tag creation as an attribute value, or predicate',
      type: 'string',
      minLength: 1,
    },
    targetOutputs: {
      description: 'A set of output and tag names',
      type: 'object',
      additionalProperties: false,
      properties: {
        outputs: {
          $ref: '#/definitions/outputSet',
          default: [],
        },
        tags: {
          $ref: '#/definitions/tagSet',
          default: [],
        },
      },
    },
    targetOutputsByTarget: {
      description: 'Defines sets of output and tag names for a set of named targets',
      type: 'object',
      propertyNames: {
        description: 'The name of an target',
        type: 'string',
        minLength: 1,
      },
      additionalProperties: {$ref: '#/definitions/targetOutputs'},
    },
  },
}
