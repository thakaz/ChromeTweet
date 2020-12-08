using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CoreTweet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChromeTweet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TweetController : ControllerBase
    {
        private readonly ILogger<TweetController> _logger;

        public TweetController(ILogger<TweetController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult>  Get(string userName,string siteName)
        {

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            string ConsumerKey = "XXXX";
            string ConsumerSecret = "XXXX";
            string AccessToken = "XXXX";
            string AccessSecret = "XXXX";

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
            _logger.LogInformation("owari");
            return Ok();

        }


    }
}
