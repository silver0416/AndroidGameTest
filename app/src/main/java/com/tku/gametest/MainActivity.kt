package com.tku.gametest

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.Button
import androidx.activity.ComponentActivity
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

class MainActivity : ComponentActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView: WebView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true

        // 初始化按鈕
        val buttonBack: Button = findViewById(R.id.buttonBack)
        val buttonForward: Button = findViewById(R.id.buttonForward)
        val buttonRefresh: Button = findViewById(R.id.buttonRefresh)
        val buttonHome: Button = findViewById(R.id.buttonHome)

        // 為按鈕添加點擊事件監聽器
        buttonBack.setOnClickListener {
            if (webView.canGoBack()) {
                webView.goBack()
            }
        }

        buttonForward.setOnClickListener {
            if (webView.canGoForward()) {
                webView.goForward()
            }
        }

        buttonRefresh.setOnClickListener {
            webView.reload()
        }

        // todo 這裡可以傳遞token給網頁
        val myParam = "我是token"

        buttonHome.setOnClickListener {
            webView.loadUrl("https://appassets.androidplatform.net/assets/index.html?param=$myParam")   //在原本的網址後方加上?param=$myParam
        }


        // WebView 資源載入
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
            .build()
        webView.webViewClient = LocalContentWebViewClient(assetLoader)
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidInterface")

        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html?param=$myParam")
    }
}

private class LocalContentWebViewClient(private val assetLoader: WebViewAssetLoader) : WebViewClientCompat() {
    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest
    ): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(request.url)
    }

    @Deprecated("Deprecated in Java")
    override fun shouldInterceptRequest(
        view: WebView,
        url: String
    ): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(Uri.parse(url))
    }
}

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun processWebData(data: String) {
        // 在這裡處理從 WebView 傳來的資料
        Log.d("WebView", "Received data from web: $data")
    }
}

