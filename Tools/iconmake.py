#-*- coding: UTF-8 -*-
import os,sys,shutil,traceback, json
from PIL import Image

reload(sys)
sys.setdefaultencoding("utf-8")

tarPlat = "ios"
icon_kind = "drawable"
root = os.path.abspath(__file__)
PJT_ROOT = os.path.abspath("../../")
PJT_SDKS=os.path.join(PJT_ROOT, "frameworks/runtime-src/proj.ios_mac/sdks/")
iconNames = {
    "ios":[
        ((20,20),"Icon-20.png", ""),
        ((40,40),"Icon-20@2x-1.png", ""),
        ((40,40),"Icon-20@2x.png", ""),
        ((60,60),"Icon-20@3x.png", ""),
        ((29,29),"Icon-29.png", ""),
        ((58,58),"Icon-29@2x-1.png", ""),
        ((58,58),"Icon-29@2x.png", ""), 
        ((87,87),"Icon-29@3x.png", ""),
        ((40,40),"Icon-40.png", ""),
        ((80,80),"Icon-40@2x-1.png", ""),
        ((80,80),"Icon-40@2x.png", ""),
        ((120,120),"Icon-40@3x.png", ""),
        ((120,120),"Icon-60@2x.png", ""),
        ((180,180),"Icon-60@3x.png", ""),
        ((76,76),"Icon-76.png", ""),
        ((152,152),"Icon-76@2x.png", ""),
        ((167,167),"Icon-83.5@2x.png", ""),
        ((1024,1024),"Icon-1024.png", ""),
        ((512,512),"iTunesArtwork.png", ""),
        ((1024,1024),"iTunesArtwork@2x.png", "")
    ],
    "android":[
        ((72,72),"ic_launcher.png", "%s-hdpi"),
        ((36,36),"ic_launcher.png", "%s-ldpi"),
        ((48,48),"ic_launcher.png", "%s-mdpi"),
        ((96,96),"ic_launcher.png", "%s-xhdpi"),
        ((144,144),"ic_launcher.png", "%s-xxhdpi"),
        ((192,192),"ic_launcher.png", "%s-xxxhdpi"),
    ]
}

def layoutIconImages(resDir,resDst=None):
    print resDir
    if resDst == None:
        resDst = resDir
    try:
        for fn in os.listdir(resDir):
            if (fn.lower()) != "icon.png": continue
            img = Image.open(os.path.join(resDir, fn))
            for v in iconNames[tarPlat]:
                folder = v[2]%(icon_kind)
                imgSize = img.size
                if imgSize[0]!=v[0][0] and imgSize[1]!=v[0][1]:
                    imt_r = img.resize(v[0], Image.ANTIALIAS)
                    if not os.path.exists(os.path.join(resDst, folder)):
                        os.makedirs(os.path.join(resDst, folder))
                    iconname = os.path.join(folder,v[1])
                    imt_r.save(os.path.join(resDst, iconname))
                    if v[1].startswith("iTunesArtwork"):
                        tarpath = os.path.join(resDst, iconname.replace(".png", ""))
                        print("move %s %s"%(iconname, iconname.replace(".png", "")))
                        shutil.move(os.path.join(resDst, iconname), tarpath)
                    print u"部署Icon资源:%s"%(os.path.join(resDst, os.path.join(folder,v[1])))
                else:
                    if os.path.exists(os.path.join(resDst, folder)):
                        if tarPlat == "android":
                            print u"删除多余Icon目录:%s"%(os.path.join(resDst, folder))
                            shutil.rmtree(os.path.join(resDst, folder))
                    else:
                        print u"部署Icon资源:icon is too small tar:%s,img:%s, passed"%(str(v[0]), str(imgSize))
    except Exception,e:
        traceback.print_exc()

def readIosSdkName():
    path=os.path.join(PJT_ROOT,"tools/deploy/iosSdk.txt")
    iosSdk = open(path)
    content="" 
    try:
         content = iosSdk.read()
    finally:
         iosSdk.close( )
#    sdks=content.split(",")
    sdks=json.loads(content)
    return sdks
def main(sdkFolder=None, sdkChannel=None):
    sdks = readIosSdkName()
    for sdk in sdks:
        if sdkFolder==None and sdkChannel==None:
            sdkFolder = sdk["folder"]
            sdkChannel = sdk["market_channels"][0]
        print "{'market_channels':['%s'],'folder':'%s'}"%(sdkChannel,sdkFolder)
        sdkFolder = os.path.join(PJT_SDKS, sdkFolder, "channels", sdkChannel)
        layoutIconImages(os.path.join(sdkFolder, "res"))
        break

if __name__ == '__main__':
    try:
        tarPlat = "android"
        icon_kind = "mipmap"
        # main("vietnam_base", "vnios01")
        layoutIconImages(r"D:\CodeSuit\Creator_Pro\xyx\Tools\com.happyeliminate.yinglongyou.aha")
    except Exception, e:
        print u"\n打印错误信息--------------------------->"
        traceback.print_exc()
        print u"打印错误信息--------------------------->\n"
