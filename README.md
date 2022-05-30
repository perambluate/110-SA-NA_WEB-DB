# 110-SA-NA_WEB-DB
A Node.js app with sqlite3 db.

## Environment
Ubuntu 20.04

## Prerequisites
- nodejs
- npm
- sqlite3
> Can be installed `nodejs` and `apm` with `apt`

## Installation
```bash=
cd 110-SA-NA_WEB-DB
npm init
npm install express sqlite3
```
Add the following content in `package.json` for quickly usage.
```json
"scripts":{
  "start": "node app.js",
  "test": "echo 'Error'$'\n' && exit 1"
}
```

## Usage
In the `db/data.db`, there is a table named `kv_pairs`, which saves key-value pairs as the following form, `<key>|<value>`.
You can use the Node.js app to do the CRUD operation on this table.
> [Note]
> The name of the key needs to be unique.
### Run server
You can use either
```
npm start
```
or
```
node app.js
```
to set up the app service.
### Test
```bash
curl localhost:6060
```
You will receive `Hello Nyaaaa!` if the server works.
### Create
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"key":"key_name", "value":"value_content"}' \
localhost:6060/key
```
It will create a key named "key_name" with value "value_content".
#### Status
- 201 : Successfully create the key. 
- 400 : Key has been already existed or some error occurs.
### Read
#### Get a single keys
```bash
curl localhost:6060/key/<key_name>
```
It will return the key of name, <key_name>, in the `kv_pairs` table.
#### Get all keys
```bash
curl localhost:6060/key
```
It will return all key in the `kv_pairs` table.
#### Status
- 200 : Successfully get the key.
- 404 : Key not found or some error occurs.
### Update
```bash
curl -X PUT -H "Content-Type: application/json" \
-d '{"value":"new_content"}' \
localhost:6060/key/<key_name>
```
It will update the content of value to "new_content" corresponding to the key of name, <key_name>.
#### Status
- 200 : Successfully update the key.
- 201 : Create the key because it's not existed.
- 400 : Some error occurs.
### Delete
#### Delete a single key
```bash
curl -X DELETE localhost:6060/key/<key_name>
```
It will delete the key of name, <key_name> in the table, `kv_pairs`.
#### Delete all keys
```bash
curl -X DELETE localhost:6060/key
```
It will delete all the keys in the table, `kv_pairs`.
#### Status
- 200 : Successfully delete the key.
- 400 : Some error occurs.
