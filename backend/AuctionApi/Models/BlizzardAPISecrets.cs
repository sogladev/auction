namespace AuctionApi.Models;

public class BlizzardAPISecrets
{
    public string ClientId => _clientId;
    public string ClientSecret => _clientSecret;

    private readonly string _clientId;
    private readonly string _clientSecret;

    public BlizzardAPISecrets(IConfiguration configuration)
    {
        _clientId = configuration["Blizzard:ClientId"];
        _clientSecret = configuration["Blizzard:ClientSecret"];
    }
}
