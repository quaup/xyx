package com.happyeliminate.yinglongyou.aha;

import android.annotation.SuppressLint;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.util.Log;

import com.transsion.core.CoreUtil;
import com.transsion.game.analytics.GameAnalytics;
import com.transsion.gamead.AdHelper;
import com.transsion.gamead.AdInitializer;
import com.transsion.gamead.GameAdLoadListener;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collections;


public class MainApplication extends MultiDexApplication {
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
    private String TAG = "MainApplication";
    private boolean isColdStart = true;
    private int activityStartNum = 0;

    private long leaveAppTime = 0;

    private boolean hasJumpMainActivity = false;

    private boolean canShowHotSplashActivity = true;

    //
    public long getLeaveAppTime() {
        return leaveAppTime;
    }

    @Override
    public void onCreate() {
        Log.d(TAG, "onCreatePre");
        super.onCreate();
        Log.d(TAG, "onCreateIng");
        initSdk();
        closeAndroidPDialog();
    }

    private void initSdk() {
        GameAnalytics.init(new GameAnalytics.Builder(this));
        CoreUtil.init(this);

        AdInitializer.init(
                new AdInitializer.Builder(this)
                        .setDebuggable(true).setEnv("test")
                        .setTestDeviceIds(Collections.singletonList("7FC2C0BE39C47406C984C08C16418C5C"))
                        .setTotalSwitch(true)
        );

        AdHelper.showAppOpen(5, new GameAdLoadListener() {
            @Override
            public void onAdLoaded() {
            }
            @Override
            public void onAdFailedToLoad(int code, String message) {
            }
        });
    }

    private void closeAndroidPDialog() {
        try {
            Class<?> cls = Class.forName("android.app.ActivityThread");
            Method declaredMethod = cls.getDeclaredMethod("currentActivityThread");
            declaredMethod.setAccessible(true);
            Object activityThread = declaredMethod.invoke(null);
            @SuppressLint("SoonBlockedPrivateApi") Field mHiddenApiWarningShown = cls.getDeclaredField("mHiddenApiWarningShown");
            mHiddenApiWarningShown.setAccessible(true);
            mHiddenApiWarningShown.setBoolean(activityThread, true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public boolean isHotStart() {
        if (1 == activityStartNum && !isColdStart && hasJumpMainActivity) {
            return true;
        }
        return false;
    }
}
