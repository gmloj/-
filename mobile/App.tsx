import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import web from './generated/web.json';
const KEY = 'dabbirni_user_state';
export default function App() {
 const view = useRef<WebView>(null);
 const queue = useRef(Promise.resolve());
 const [html,setHtml] = useState<string|null>(null);
 const [error,setError] = useState('');
 useEffect(()=>{
  AsyncStorage.getItem(KEY).then(saved=>{
   const script = `<script>window.__DABBIRNI_STATE__=${JSON.stringify(saved||'').replace(/</g,'\\u003c')};</script>`;
   setHtml(web.html.replace('<head>','<head>'+script));
  }).catch(()=>setError('تعذرت قراءة بياناتك. أغلق التطبيق وأعد فتحه؛ لم نغيّر بياناتك.'));
  const back=BackHandler.addEventListener('hardwareBackPress',()=>{
   view.current?.injectJavaScript("window.dispatchEvent(new Event('native-back')); true;");return true;
  });
  return ()=>back.remove();
 },[]);
 return <SafeAreaProvider><SafeAreaView style={{flex:1,backgroundColor:'#070A12'}} edges={['top','bottom']}>
  <StatusBar style="light"/>
  {!!error && <Text accessibilityRole="alert" style={{color:'#fda4af',padding:12,textAlign:'center'}}>{error}</Text>}
  {html ? <WebView ref={view} source={{html,baseUrl:'https://dabbirni.local/'}} originWhitelist={['*']}
    style={{flex:1,backgroundColor:'#070A12'}} javaScriptEnabled domStorageEnabled
    setSupportMultipleWindows={false} allowsInlineMediaPlayback
    onShouldStartLoadWithRequest={request=>request.url==='about:blank'||request.url==='https://dabbirni.local/'}
    onError={()=>setError('تعذر عرض التطبيق. أعد فتحه.')}
    onMessage={event=>{
     try {
      const message=JSON.parse(event.nativeEvent.data);
      if(message.type!=='save-state'||typeof message.data!=='string'||message.data.length>5000000)return;
      const state=JSON.parse(message.data);
      if(!Number.isFinite(state.currentBalance)||!Array.isArray(state.todayExpenses))return;
      queue.current=queue.current.then(()=>AsyncStorage.setItem(KEY,message.data)).then(()=>setError('')).catch(()=>setError('تعذر حفظ آخر تعديل. لا تغلق التطبيق قبل إعادة المحاولة.'));
     } catch {setError('تعذر حفظ البيانات.');}
    }}/>:<View style={{flex:1,justifyContent:'center'}}><ActivityIndicator color="#67e8f9"/></View>}
 </SafeAreaView></SafeAreaProvider>;
}
