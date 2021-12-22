# aad app get

Gets an Azure AD app registration

## Usage

```sh
m365 aad app get [options]
```

## Options

`--appId [appId]`
: Application (client) ID of the Azure AD application registration to get. Specify either `appId`, `objectId` or `name`

`--objectId [objectId]`
: Object ID of the Azure AD application registration to get. Specify either `appId`, `objectId` or `name`

`--name [name]`
: Name of the Azure AD application registration to get. Specify either `appId`, `objectId` or `name`

--8<-- "docs/cmd/_global.md"

## Remarks

For best performance use the `objectId` option to reference the Azure AD application registration to update. If you use `appId` or `name`, this command will first need to find the corresponding object ID for that application.

If the command finds multiple Azure AD application registrations with the specified app name, it will prompt you to disambiguate which app it should use, listing the discovered object IDs.

## Examples

Get the Azure AD application registration by its app (client) ID

```sh
m365 aad app get --appId d75be2e1-0204-4f95-857d-51a37cf40be8
```

Get the Azure AD application registration by its object ID

```sh
m365 aad app get --objectId d75be2e1-0204-4f95-857d-51a37cf40be8
```

Get the Azure AD application registration by its name

```sh
m365 aad app get --name "My app"
```