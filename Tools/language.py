#coding:utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import os, re, chardet, traceback, json
from collections import OrderedDict
from pathlib2 import Path
import project

class Language(object):
    def __init__(self, stem):
        self.order = 1
        self.stem = stem
        self.txtdict = dict()
        self.txtlist = list()
    def add(self, txt):
        if self.txtdict.has_key(txt):
            return self.txtdict[txt]
        key = "LAN_%s_%s"%(self.stem, self.order)
        self.txtlist.append(txt)
        self.txtdict[txt] = key
        self.order += 1
        return "window.%s" % key
    def format(self):
        content = ""
        for txt in self.txtlist:
            key = self.txtdict[txt]
            
            content += fmt
        return content
    def filter(self, mapper):
        for txt in self.txtlist:
            key = self.txtdict[txt]
            mapper and mapper(key, txt)
        
class LanguageDict(object):
    def __init__(self):
        self.landict = dict()

    def add(self, stem, txt):
        language = None
        if self.landict.has_key(stem):
            language = self.landict[stem]
        else:
            language = Language(stem)
            self.landict[stem] = language
        return language.add(txt)

    def save(self, path):
        dic = dict()
        with open(path, "wb") as fi:
            content = ""

            keydict = dict()
            txtlist = list()
            varlist = list()
            def mapper1(key, txt):
                txtlist.append("\t%s:string\n" % (key))
            def mapper(key, txt):
                if not keydict.has_key(txt):
                    keydict[txt] = key
                    txtlist.append("window.%s = %s;\n" % (key.ljust(20), txt))
                else:
                    upkey = keydict[txt]
                    varlist.append("window.%s = window.%s;\n" % (key.ljust(20), upkey))
            txtlist.append("declare interface Window {\n")
            for language in self.landict.values():
                language.filter(mapper1)
            txtlist.append("}\n")
            for language in self.landict.values():
                language.filter(mapper)

            content += "".join(txtlist);
            content += "\n"*7;
            content += "".join(varlist);
            print(content)
            fi.write(content)
        fi.close()

class Prefab(object):
    def __init__(self, stem):
        self.list = []
        self.stem = stem
    def add(self, __id__, __txt__):
        obj = dict()
        obj["__id__"] = __id__
        obj["__txt__"] = __txt__
        self.list.append(obj)
    def get_list(self):
        return self.list
class PrefabDict(object):
    def __init__(self):
        self.conf = OrderedDict()
    def add(self, stem, jsondata):
            # pref = Path(os.path.abspath(prefabpath))
        prefab = Prefab(stem)
        for con in jsondata:
            _Nstring = con.has_key("_N$string") and con["_N$string"]
            if _Nstring:
                ret = re.findall(u"([^\"]*)[\u4e00-\u9fa5]+", _Nstring)
                if ret and len(ret) > 0:
                    node = con.has_key("node") and con["node"]
                    __id__ = node.has_key("__id__") and node["__id__"]
                    # print stem, _Nstring, node, __id__
                    prefab.add(__id__, _Nstring)
        tl = prefab.get_list()
        if len(tl) > 0: self.conf[stem] = tl
    def save(self, path):
        p = Path(path)
        with p.open("w") as fp:
            fp.write(json.dumps(self.conf, encoding="utf-8", ensure_ascii=False, indent=4))
        fp.close()
    def importJson(self, jsonfile):
        p = Path(jsonfile)
        # if not p.exists(): raise Exception("%s not exist"%jsonfile)
        try:
            jsondata = json.load(p.open("r"))
            for key in jsondata:
                jsonvalue = jsondata[key]
                fn = project.PRO_ROOT.joinpath(key)
                data = json.load(fn.open("r", encoding="utf-8"), encoding="utf-8", object_pairs_hook=OrderedDict)


                for con in data:
                    node = con.has_key("node") and con["node"]
                    _Nstring = con.has_key("_N$string") and con["_N$string"]
                    if _Nstring and node:
                        for value in jsonvalue:
                            if(node["__id__"] == value["__id__"]):
                                _string = con["_string"]
                                con["_string"] = value["__txt__"]
                                con["_N$string"] = value["__txt__"]
                                print("__id__{%s}{%s}写入{%s}"%(node["__id__"], _string, value["__txt__"]))
                fn.open("w").write(json.dumps(data, encoding="utf-8", ensure_ascii=False, indent=2))
                # print(fn)
                # fn.
            
        except Exception, e:
            print(traceback.print_exc())
        else:
            pass
        finally:
            pass
# def find_ch_text(text):
#     # partern = re.compile()
#     return re.findall(u"([^\"]*)[\u4e00-\u9fa5].*?", text)
def handle_ts_text(languageDict, i):
    if i.name == "Language.ts": return
    lines = None
    with i.open(encoding="UTF-8") as fi:
        stem = i.stem
        lines = fi.readlines()
        for j in xrange(0, len(lines)):
            content = lines[j]
            cond = re.findall("((cc|console)\.(log|warn|error))|(tooltip:)", content)
            if cond and len(cond) > 0:
                # print(json.dumps(cond, ensure_ascii=False))
                pass
            else:
                ret = re.findall(u"\"[\u4e00-\u9fa5].*?\"", content)
                if ret and len(ret) > 0:
                    for txt in ret:
                        key = languageDict.add(stem, txt)
                        content = content.replace(txt, key)
                    lines[j] = content
                    print(json.dumps(content, ensure_ascii=False))
    fi.close()
    if lines and len(lines) > 0:
        with i.open("w", encoding="UTF-8") as fi:
            fi.write("".join(lines))
        fi.close()
def handle_json_text(prefabDict, i):
    try:
        # jsontxt = .read()
        # uni = jsontxt.decode("unicode")
        # utf = uni.encodini.open("r")g("utf-8")
        jsondata = json.load(i.open("r", encoding="utf-8"), object_pairs_hook=OrderedDict)
        # print(str(i).replace("a", "1"))
        relativePath = project.relativePath(str(i))
        prefabDict.add(relativePath, jsondata)

        i.open("w", encoding="utf-8").write(json.dumps(jsondata, ensure_ascii=False, sort_keys=False, indent=2))
        # break
    except Exception, e:
        raise (traceback.print_exc())
def main():
    print(project.ASSETS)
    languageDict = LanguageDict()
    
    
    prefabDict = PrefabDict()
    # for i in project.ASSETS.glob("**/*"):
    #     ists = i.name.endswith(".ts")
    #     isscene = i.name.endswith(".fire")
    #     isprefab = i.name.endswith(".prefab")
    #     if ists:
    #         # handle_ts_text(prefabDict, i)
    #         pass
    #     elif isscene:
    #         handle_json_text(prefabDict, i)
    #         pass
    #     elif isprefab:
    #         # handle_json_text(prefabDict, i)
    #         pass
    # prefabDict.save("./Prefab.json")
    # languageDict.save(r"D:\CodeSuit\CreatorPro\Zombie\assets\script\utils\Language.ts")

    prefabDict.importJson("./Scene_en.json")
if __name__ == "__main__":
    main()
    # d = dict()
    # print(d.items, d.values)
    # content = ('需要先解锁').decode("utf-8")
    # ret = re.findall("[\u4e00-\u9fa5]", content)
    # print(ret)
		