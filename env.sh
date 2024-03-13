#!/bin/bash

# Print relevant environment variables
env | grep -i ecommerce_

# Recreate config file and assignment
echo "window._env_ = {" > ./src/env-config.js

# Loop on environment variables prefixed with
# ecommerce_var and add them to env-config.js
for ecommerce_var in $(env | grep ECOMMERCE_); do
    varname=$(printf '%s\n' "$ecommerce_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$ecommerce_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done

echo "}" >> ./src/env-config.js
