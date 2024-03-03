namespace AuctionApi.Models;

public class BlizzardAPISecrets
{
    public string ClientId => _clientId;
    public string ClientSecret => _clientSecret;

    private readonly string _clientId;
    private readonly string _clientSecret;

    public BlizzardAPISecrets(IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        _clientId = configuration["Blizzard:ClientId"]
            ?? throw new ArgumentNullException("ClientId is required.");
        _clientSecret = configuration["Blizzard:ClientSecret"]
            ?? throw new ArgumentNullException("ClientSecret is required.");

    }
}
