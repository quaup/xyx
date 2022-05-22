package com.happyeliminate.yinglongyou.aha.activity;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.cocos.game.AppActivity;
import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.transsion.game.analytics.Constants;
import com.transsion.game.analytics.GameAnalytics;
import com.transsion.gamead.AdHelper;
import com.transsion.gamead.GameAdLoadListener;
import com.transsion.gamead.GameAdRewardShowListener;
import com.transsion.gamead.GameAdShowListener;
import com.transsion.gamead.GameRewardItem;

import java.util.ArrayList;
import java.util.List;

import androidx.core.app.ActivityCompat;

public class MainActivity extends AppActivity {

    private static final String TAG = "MainActivity";

    private static final int REQUEST_PERMISSIONS_CODE = 100;
    private List<String> mNeedRequestPMSList = new ArrayList<>();

    public boolean FloatAdLoaded  = false;
    public boolean RewardAdLoaded = false;
    public boolean NativeAdLoaded = false;
    public boolean CallJsForInterstitialAD = false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreatePre");
        super.onCreate(savedInstanceState);
        Log.d(TAG, "onCreateIng");

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            /**
             * 如果你的targetSDKVersion >= 23，就要主动申请好权限。如果您的App没有适配到Android6.0（即targetSDKVersion < 23），那么只需要在这里直接调用fetchSplashAd方法。
             *
             */
            checkAndRequestPermissions();
        } else {
            /**
             * 如果是Android6.0以下的机器，默认在安装时获得了所有权限，可以直接调用SDK。
             */
            initData();
        }
    }

    private void checkAndRequestPermissions() {
        /**
         * Android Q以下READ_PHONE_STATE 权限是必须权限，没有这个权限SDK无法正常获得广告。
         */
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q && PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE)) {
            mNeedRequestPMSList.add(Manifest.permission.READ_PHONE_STATE);
        }
        /**
         * WRITE_EXTERNAL_STORAGE、ACCESS_FINE_LOCATION 是两个可选权限；没有不影响SDK获取广告；但是如果应用申请到该权限，会显著提升应用的广告收益。
         */
        if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            mNeedRequestPMSList.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            mNeedRequestPMSList.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        //
        if (0 == mNeedRequestPMSList.size()) {
            /**
             * 权限都已经有了，那么直接调用SDK请求广告。
             */
            initData();
        } else {
            /**
             * 有权限需要申请，主动申请。
             */
            String[] temp = new String[mNeedRequestPMSList.size()];
            mNeedRequestPMSList.toArray(temp);
            ActivityCompat.requestPermissions(this, temp, REQUEST_PERMISSIONS_CODE);
        }
    }

    /**
     * 处理权限申请的结果
     *
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            /**
             *处理SDK申请权限的结果。
             */
            case REQUEST_PERMISSIONS_CODE:
                initData();
//                else {
//                    /**
//                     * 如果用户没有授权，那么应该说明意图，引导用户去设置里面授权。
//                     */
//                    Toast.makeText(this, "应用缺少SDK运行必须的READ_PHONE_STATE权限！请点击\"应用权限\"，打开所需要的权限。", Toast.LENGTH_LONG).show();
//                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
//                    intent.setData(Uri.parse("package:" + getPackageName()));
//                    startActivity(intent);
//                    finish();
//                }
                break;
            default:
                break;
        }
    }

    private void initData() {
        this.track(Constants.ACTION_APP_START, "", "");
        AdHelper.loadInterstitial(this, new GameAdLoadListener()
        {
            @Override
            public void onAdFailedToLoad(int code, String message) {
                Log.i(TAG, "Interstitial onAdFailedToLoad " + code + " " + message);
            }
            @Override
            public void onAdLoaded() {
                Log.i(TAG, "Interstitial onAdLoaded");
            }
        });

        //  预加载激励视频广告
        AdHelper.loadReward(this, new GameAdLoadListener()
        {
            @Override
            public void onAdFailedToLoad(int code, String message) {
                Log.i(TAG, "Reward onRewardedAdFailedToLoad " + code + " " + message);
            }
            @Override
            public void onAdLoaded() {
                MainActivity.this.RewardAdLoaded = true;
                Log.i(TAG, "Reward onRewardedAdLoaded");
            }
        });

//       预载原生广告
        AdHelper.loadNative(new GameAdLoadListener() {
            @Override
            public void onAdLoaded() {
                MainActivity.this.NativeAdLoaded = true;
                Log.i(TAG, "Native onAdLoaded");
            }
            @Override
            public void onAdFailedToLoad(int code, String message) {
                Log.i(TAG, "Native onAdFailedToLoad " + code + " " + message);
            }
        });
        //预加载悬浮(Float)广告
        AdHelper.loadFloat(this, new GameAdLoadListener() {
            @Override
            public void onAdFailedToLoad(int code, String message) {
                Log.i(TAG, "Float onAdFailedToLoad " + code + " " + message);
            }
            @Override
            public void onAdLoaded() {
                MainActivity.this.FloatAdLoaded = true;
                Log.i(TAG, "Float onAdLoaded");
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    public void playRewardAd() {
        Log.d(TAG, "playRewardAd");

        AdHelper.showRewardWhenLoaded(this, new GameAdRewardShowListener(){
            @Override
            public void onShow() {
                Log.i(TAG, "Reward show");
            }
            @Override
            public void onClose() {
                Log.i(TAG, "Reward close");
            }
            @Override
            public void onClick() {
                Log.i(TAG, "Reward onClick");
            }
            @Override
            public void onAdImpression() {
                Log.i(TAG, "Reward onAdImpression");
            }
            @Override
            public void onShowFailed(int code, String message) {
                Log.i(TAG, "Reward show fail " + code + " " + message);
                Toast.makeText(MainActivity.this, "Ad load failed", Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onUserEarnedReward(GameRewardItem rewardItem) {
                Log.i(TAG, "Reward onUserEarnedReward " + rewardItem.getType() + " " + rewardItem.getAmount());
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("videoAdCallback()");
                    }
                });
            }
        });
    }
    public void playNativeAd(){
        Log.d(TAG, "NativeAd not implement");
    }

    public void playFloatAd() {
        Log.d(TAG, "playFloatAd");
        int width = FrameLayout.LayoutParams.WRAP_CONTENT;
        int height = FrameLayout.LayoutParams.WRAP_CONTENT;
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(width, height);
        layoutParams.gravity = Gravity.BOTTOM;
        DisplayMetrics displayMetrics = getResources().getDisplayMetrics();
        layoutParams.bottomMargin = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP
                , 100f, displayMetrics);
        int dp16 = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 16f, displayMetrics);
        layoutParams.setMarginStart(dp16);
        layoutParams.setMarginEnd(dp16);
        AdHelper.showFloatWhenLoaded(this, layoutParams, new GameAdShowListener() {
            @Override
            public void onShow() {
                Log.i(TAG, "Float show");
            }
            @Override
            public void onClose() {
                Log.i(TAG, "Float close");
            }
            @Override
            public void onClick() {
                Log.i(TAG, "Float onClick");
            }
            @Override
            public void onAdImpression() {
                Log.i(TAG, "Float onAdImpression");
            }
            @Override
            public void onShowFailed(int code, String message) {
                Log.i(TAG, "Float show fail " + code + " " + message);
                Toast.makeText(MainActivity.this, "Ad load failed", Toast.LENGTH_SHORT).show();
            }
        });
    }
    public void closeFloatAd() {
        AdHelper.closeFloat(this);
    }
    public void playInterstitialAD(){
        Log.d(TAG, "playInterstitialAD : " + this.CallJsForInterstitialAD + "");
        if(this.CallJsForInterstitialAD == true) return;
        AdHelper.showInterstitialWhenLoaded(this, new GameAdShowListener() {

            @Override
            public void onShow() {
                Log.i(TAG, "Float onShow");
            }

            @Override
            public void onShowFailed(int code, String message) {
                Log.i(TAG, "Float show fail " + code + " " + message);
                Toast.makeText(MainActivity.this, "Ad load failed", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onClose() {
                Log.i(TAG, "Float onClose");
                if(!MainActivity.this.CallJsForInterstitialAD) {
                    MainActivity.this.CallJsForInterstitialAD = true;
                    CocosHelper.runOnGameThread(new Runnable() {
                        @Override
                        public void run() {
                            CocosJavascriptJavaBridge.evalString("videoAdCallback()");
                        }
                    });
                }
            }

            @Override
            public void onClick() {
                Log.i(TAG, "Float onClick");
            }

            @Override
            public void onAdImpression() {
                Log.i(TAG, "Float onAdImpression");
                if(!MainActivity.this.CallJsForInterstitialAD) {
                    MainActivity.this.CallJsForInterstitialAD = true;
                    CocosHelper.runOnGameThread(new Runnable() {
                        @Override
                        public void run() {
                            CocosJavascriptJavaBridge.evalString("videoAdCallback()");
                        }
                    });
                }
            }
        });
    }
    public void track(String name, String s1, String s2) {
        Log.i(TAG, String.format("track {%s}, %s, %s", name, s1, s2));
        GameAnalytics.tracker(name, s1, s2);
    }
    private void printStatusMsg(String txt) {
        if (null != txt) {
            Log.d(TAG, txt);
        }
    }
}
