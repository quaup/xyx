#coding:utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import os, re, chardet, traceback
# import pathlib, json
from pathlib2 import Path

PRO_ROOT = Path(os.path.abspath("../"))
ASSETS = PRO_ROOT.joinpath("assets")

def relativePath(path):
    ret = path.replace(str(PRO_ROOT)+"\\", "")
    # print(ret)
    return ret

if __name__ == "__main__":
    print PRO_ROOT, PRO_ROOT.exists()
    print ASSETS, ASSETS.exists()
    # print relativePath(path)
    # d = dict()
    # print(d.items, d.values)
    # content = ('需要先解锁').decode("utf-8")
    # ret = re.findall("[\u4e00-\u9fa5]", content)
    # print(ret)
		