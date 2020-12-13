using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using CoreTweet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using static CoreTweet.OAuth;

namespace ChromeTweet.Controllers
{
    public class AccKeys
    {
        public string AccessToken { get; set; }
        public string AccessTokenSecret{ get; set; }
    }



    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TweetController : ControllerBase
    {
        private readonly ILogger<TweetController> _logger;

        public TweetController(ILogger<TweetController> logger)
        {
            _logger = logger;
        }

        string ConsumerKey = "mClqsiOczR4NlgEA8GpVwMlIR";
        string ConsumerSecret = "CfTZV8QMt1d4ZdM4KfOHxQpDzQ1cCVLs6hth7a86CHBhOdOhXh";
        string AccessToken = "";
        string AccessSecret = "";

        [HttpGet]
        public async Task<IActionResult>  Get(string userName,string siteName)
        {

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;


            try
            {
                //認証
                Tokens tokens = Tokens.Create(ConsumerKey, ConsumerSecret, AccessToken, AccessSecret);
                //ツイートする
                Status status = await tokens.Statuses.UpdateAsync(new { status = DateTime.Now +":" +  userName +  ":" + siteName });
            }
            catch (TwitterException e)
            {
                //CoreTweetに関するエラー。
                Console.WriteLine(e.Message); //メッセージを表示する
                Console.ReadKey();
            }
            catch (System.Net.WebException e)
            {
                //インターネット接続に関するエラー。
                Console.WriteLine(e.Message); //メッセージを表示する
                Console.ReadKey();
            }
            //_logger.LogInformation(session);
            return Ok();

        }

        //
        [HttpGet]
        public async Task<IActionResult> ShowAuthWindow()
        {
            OAuthSession session = await OAuth.AuthorizeAsync(ConsumerKey, ConsumerSecret);

            HttpContext.Session.SetObject("key", session);

            //dotnetCoreでは使えないらしい?
            //System.Diagnostics.Process.Start(session.AuthorizeUri.AbsoluteUri);
            var url = session.AuthorizeUri.AbsoluteUri;
            try
            {
                
                Process.Start(url);
            }
            catch
            {
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    //Windowsのとき  
                    url = url.Replace("&", "^&");
                    Process.Start(new ProcessStartInfo("cmd", $"/c start {url}") { CreateNoWindow = true });
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                {
                    //Linuxのとき  
                    Process.Start("xdg-open", url);
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                {
                    //Macのとき  
                    Process.Start("open", url);
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }


        public async Task<IActionResult> AuthPinCode(string pin)
        {
            try { 
            OAuthSession session = HttpContext.Session.GetObject<OAuthSession>("key");
            Tokens tokens = await OAuth.GetTokensAsync(session, pin);

            Status status = await tokens.Statuses.UpdateAsync(new { status = DateTime.Now});

                return Ok(GetAccessTokensKey(tokens));
            }
            catch(Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult CheckAuth([FromBody]AccKeys keys)
        {
            try
            {
                //AccKeys keys = (AccKeys)JsonConvert.DeserializeObject(fromBody); 
                //認証
               Tokens newTokens = Tokens.Create(ConsumerKey, ConsumerSecret, keys.AccessToken, keys.AccessTokenSecret);

              UserResponse  ur = newTokens.Account.VerifyCredentials();
                return Ok(ur.ScreenName);
        
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }

        }



        //トークンから必要なものをJsonへ
        private static string GetAccessTokensKey(Tokens tokens)
        {
            IDictionary<string, string> tokenMap = new Dictionary<string, string>();
            tokenMap.Add("AccessToken", tokens.AccessToken);
            tokenMap.Add("AccessTokenSecret", tokens.AccessTokenSecret);
            string serializedTokenMap = JsonConvert.SerializeObject(tokenMap);

            return serializedTokenMap;
        }


    }



    // セッションにオブジェクトを設定・取得する拡張メソッドを用意する
    public static class SessionExtensions
    {
        // セッションにオブジェクトを書き込む
        public static void SetObject<TObject>(this ISession session, string key, TObject obj)
        {
            var json = JsonConvert.SerializeObject(obj);
            session.SetString(key, json);
        }

        // セッションからオブジェクトを読み込む
        public static TObject GetObject<TObject>(this ISession session, string key)
        {
            var json = session.GetString(key);
            return string.IsNullOrEmpty(json)
                ? default(TObject)
                : JsonConvert.DeserializeObject<TObject>(json);
        }

    }

}
