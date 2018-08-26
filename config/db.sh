#!/bin/bash

NAME='starter'

if [ -n "$1" ]; then
    NAME=$1
fi

psql -U postgres -c "CREATE USER $NAME;"
psql -U postgres -c "CREATE DATABASE $NAME;"
psql -U postgres -c "alter user $NAME with encrypted password '$NAME';"
psql -U postgres -c "grant all privileges on database $NAME to $NAME;"
