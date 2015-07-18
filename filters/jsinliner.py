#!/usr/bin/env python

# Author: Mort Yao <soi@mort.ninja>
# License:
#   This is free and unencumbered software released into the public domain.

from pandocfilters import *
import re
def d(obj): print(obj, file=sys.stderr)

_fmt_supported = ['html', 'html5',
                  'slidy', 'slideous', 'dzslides', 'revealjs', 's5']

# Patterns of block commands
_cmd_patterns = {
    'meta'         : '^(meta)$',
    'html'         : '^(html)$',
    'css'          : '^(css)$',
    'js'           : '^(js)$',
}

# Alternative commands (shortcuts)
_cmd_alt = {}

def inliner(key: str, value: dict, fmt: str, meta: dict) -> dict:
    """Main filter."""

    if fmt not in _fmt_supported:
        raise Exception('Unsupported format: ' + fmt)
    fmt = 'html'

    try:
        if key == 'Para':
            # block commands
            t, c = value[0]['t'], value[0]['c']
            v = value[2:] # skip the next Space
            if t == 'Str' and c[0] == ':':
                cmd_strings = c[1:].split(',')
                cmd = {}
                for cmd_string in cmd_strings:
                    cmd_name, cmd_match = None, None
                    for name in _cmd_patterns:
                        cmd_pattern = _cmd_patterns[name]
                        cmd_match = re.match(cmd_pattern, cmd_string)
                        if cmd_match:
                            cmd_name = name
                            break
                    if cmd_match:
                        cmd[cmd_name] = list(cmd_match.groups()[1:])
                    elif cmd_string in _cmd_alt:
                        cmd.update(_cmd_alt[cmd_string])
                    else:
                        return # unknown block command

                if 'meta' in cmd:
                    script = 'var _meta = new Object();\n'
                    for meta_f in meta:
                        if meta[meta_f]['t'] == 'MetaString':
                            meta_v = meta[meta_f]['c']
                            script += "_meta['{}'] = '{}';\n" \
                                .format(meta_f, meta_v)

                        elif meta[meta_f]['t'] == 'MetaInlines':
                            meta_v = ''
                            for i in meta[meta_f]['c']:
                                if i['t'] == 'Str':
                                    meta_v += i['c']
                                elif i['t'] == 'Space':
                                    meta_v += ' '
                                # TODO: more types
                            if re.match(r'^mailto:', meta_v):
                                # obfuscate email address
                                meta_v = "'+'".join(list(meta_v))
                            script += "_meta['{}'] = '{}';\n" \
                                .format(meta_f, meta_v)

                        # TODO: MetaBool, MetaList, ...
                        else:
                            pass

                    return RawBlock(fmt, '<script>\n' + script + '</script>')

                return
            return # not a command

        elif key == 'CodeBlock':
            # block commands
            c = value[0][1][0] if value[0][1] else None
            v = value[1]
            if c and c[0] == ':':
                cmd_strings = c[1:].split(',')
                cmd = {}
                for cmd_string in cmd_strings:
                    cmd_name, cmd_match = None, None
                    for name in _cmd_patterns:
                        cmd_pattern = _cmd_patterns[name]
                        cmd_match = re.match(cmd_pattern, cmd_string)
                        if cmd_match:
                            cmd_name = name
                            break
                    if cmd_match:
                        cmd[cmd_name] = list(cmd_match.groups()[1:])
                    elif cmd_string in _cmd_alt:
                        cmd.update(_cmd_alt[cmd_string])
                    else:
                        return # unknown block command

                if 'html' in cmd:
                    return RawBlock(fmt, v)
                if 'css' in cmd:
                    return RawBlock(fmt, '<style type="text/css">\n' + v +
                                    '\n</style>')
                if 'js' in cmd:
                    return RawBlock(fmt, '<script>\n' + v + '\n</script>')

            return
        return # not a command

    except:
        raise Exception('Malformed AST in: ' + key)

if __name__ == "__main__":
    toJSONFilter(inliner)
