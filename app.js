// JavaScript source code
var linebot = require('linebot');
var express = require('express');
var app = new express();

var bot = linebot({
    channelId: '1654462874',
    channelSecret: '58511c6e40bf7c8b9e762308e25dab23',
    channelAccessToken: {
        "p": "1tMsx1J-SL36TTF4Caew7qjNHHfNKp1TlhcXhYS4QkFsJjuRJk_2dPNpBY0TJSItjddt9iYyVwu9ykyfEG47HGXEe00kbu_C2ML70zHpwM7cO9FhZsptvznaMLw4ryKeNsI2MJG30Yzdrx7cLRTYlGMYUlXWaRkI0bEeiXuyez0",
        "kty": "RSA",
        "q": "0HmG1nVRQp3Dj2tMteEUT6_EI9aP2IbaxZuF6cL_90MqeFUolXxqsxw2Z7dYvTQSGXkQcrNwOPM0RfhO-WiDTVuTfGamFqvPFNLl9mmEj0LJ7H5wibzMIdnPhWhvzLYAceITv3FwNeAjLRyv7ctzSgSEw0Ghp06XN9xMtIn0Ixk",
        "d": "l8oRxSKs1RquNEzRNH5HMphWXG2qals2Lm3N5210mfVuthaa_wqFGvQD_ZmWZdyGoQaUVXBqoy_wB6UKWJkpmDfv7n-Ezr0rYkD6rQjbym5hWwCPI-azq5NXCfA4QgTDX71GrftEcO3aBR77OCoSJQ5_Z4wzfFWIirsaTX5Zc9GY3kjHSYN_icmZ_xMCT1KKcTi4l4Gvuw7VGhLYiO7buNE3zGeONjKhT2ynBiEdf6fyJ3QvFYZINdNyrp1wSMMaw0f55ZWiJc5omPhlgMPB3gtzFwenviaD5J04_jPGBBRs7xNkZzX-QoOy_ZxtBJb4GTnjvFHZN8RlbmbT9VsyYQ",
        "e": "AQAB",
        "use": "sig",
        "kid": "5b1c4a3a-3232-4e5d-817a-747a357a2443",
        "qi": "N2MmYI0VogYCt16WBx3s4G5hq6FILb_osrGRntCUmI0EKZuc4spSblrq9lOGPX2bw3vDqM7jr_jOh8UdtGSQVicpKzU27R1L3dA1kqCdtyzR-DqxUx3kJ9UdWsDr0k3sc-5E0appLkIrRyBt_rj891P_-jI1S5r1usZl-MelZXk",
        "dp": "0BvDRVSlAdMIp79EihXpUUo1aV6lYqMGVmAIaVApMAYwvtj1xCeymZk0JCyGX3K8rqwD2nEmUy0Mru2LKl-e4-Oyc8BHizC5kUNSsUWpLR84OrqboPh5WMaymIO-ZesjWejKlkKT0GymVP-QTBvls9pLtXdyPl4CLSFoc8dhIAE",
        "alg": "RS256",
        "dq": "porfGAYiw4gLCVDbuFS2CC7PDx5CTeT1cnWa1jMsjth-XiERydHZ33pDUDndT1EAwI7BgBAvL5_Ce78xP_epJSxqNzA9sNDSHr2YbnC_MD9X1nDv8Gj93nEFYnsbDTu8QT4tLnwt-ywyjcBkHyCv2kqf0OhmfqS_EyYPtQ6cFUk",
        "n": "rvGPWJ2nEMblvCZUBewgZpKU_ocnwfgWe0sE5jbBCUUWQq5nvl3wvqPJ7bzf234XUY9ftYocFP27YL2G9x2Atx090dDFN8jni_mOqA8z37iYtzlX3lnZlvsSsZo8kAi9gKPU2VmEIarqYYu_560-pq2AhSs4RgU8PjwWyHYOlmEuWyWpCXVoubM1fYiKHUwBvilOmwshTKXltkwjsbssBhk425wU1GtiB5dHtvaSk9x2rRR3HH8gK4OpfyxjCMpSyZuzo2tmwvqds-yTme7SdNXKLRXrYtG2A-pQarRX2N1nZC02TjdfxZOUb3G8HNOLrQx0sspBgutZNfRLlmtf9Q"
    }
});

var linebotparser = bot.parser();
bot.on('message', function (event) {
    console.log(event);
});

app.post('/', linebotparser);

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log('app now running on port', port);
});