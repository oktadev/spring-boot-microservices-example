#!/usr/bin/env python

import os
import re

if __name__ == '__main__':

    dist_dir = 'client/dist'

    contents = ''

    sw_js = 'sw.js'
    with open(os.path.join(dist_dir, sw_js), 'r') as swjs:
        contents = swjs.read()
        js_re = r'\..*\.bundle\.js'
        results = re.findall(js_re, contents)

        for r in [x for x in results if x.strip() != '']:
            root = r.split('.bundle.js')[0]
            root = root[2:].strip()
            match = [a for a in os.listdir(dist_dir) if a.startswith(root) and a.endswith('.js')][0]
            find = r
            replace = './' + match
            print(find, '=>', replace)
            contents = contents.replace(find, replace)

    with (open(os.path.join(dist_dir, sw_js), 'w')) as swjs:
        swjs.write(contents)

