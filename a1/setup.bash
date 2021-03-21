#!/bin/bash
if [ $# -ne 1 ]
then
    echo "Usage: setup.bash DIR"
    echo "to set permissions and group for existing directory DIR"
    echo "Example: ./setup.bash games01"
    exit 1;
fi

find $1  -type d -exec chmod 750 {} \;
find $1  -type f -exec chmod 640 {} \;
chgrp -R www-data $1
chmod g+w $1/sess
