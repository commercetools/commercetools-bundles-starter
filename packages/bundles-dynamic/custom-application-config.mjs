import {entryPointUriPath, PERMISSIONS} from "./src/constants";

const config = {
    name: "Dynamic bundles",
    entryPointUriPath: entryPointUriPath,
    cloudIdentifier: "gcp-us",
    env: {
        production: {
            applicationId: "",
            url: "",
        },
        development: {
            initialProjectKey: ""
        }
    },
    additionalEnv: {
        mcURL:"mc.us-central1.gcp.commercetools.com"
    },
    mainMenuLink: {
        key: "bundles-dynamic",
        uriPath: "dynamic-bundle-manager",
        icon: "RocketIcon",
        permissions: [PERMISSIONS.View, PERMISSIONS.Manage],
        featureToggle: null,
        submenu: [],
        defaultLabel: "Custom Configurations",
        labelAllLocales: [
            {
                locale: "en",
                value: "Dynamic Bundles"
            },
            {
                locale: "de",
                value: "Dynamic Bundles"
            },
            {
                locale: "es",
                value: "Dynamic Bundles"
            }
        ]
    }
}

export default config
