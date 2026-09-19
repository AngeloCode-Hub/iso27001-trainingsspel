using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Allow the React dev server (localhost:5173 by default) to call this API.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors();

var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

string DataPath(string fileName) =>
    Path.Combine(app.Environment.ContentRootPath, "Data", fileName);

// GET /api/quiz?lang=nl  (or ?lang=en)
// Returns the full category/question set for one language.
app.MapGet("/api/quiz", (string lang = "nl") =>
{
    var path = DataPath("iso27001-quiz-data-bilingual.json");
    if (!File.Exists(path))
        return Results.Problem("Quiz data file not found on the server.");

    using var doc = JsonDocument.Parse(File.ReadAllText(path));
    if (!doc.RootElement.TryGetProperty(lang, out var langData))
        return Results.NotFound(new { error = $"Language '{lang}' not found. Use 'nl' or 'en'." });

    return Results.Text(langData.GetRawText(), "application/json");
});

// POST /api/scores
// Body: { "employeeName": "...", "categoryId": "phishing", "correct": 3, "total": 4, "lang": "nl" }
// Appends a score record to Data/scores.json — a lightweight training-record log
// (evidence that an employee completed a given awareness topic).
app.MapPost("/api/scores", async (ScoreSubmission submission) =>
{
    var scoresPath = DataPath("scores.json");
    var scores = new List<ScoreRecord>();

    if (File.Exists(scoresPath))
    {
        var existing = await File.ReadAllTextAsync(scoresPath);
        if (!string.IsNullOrWhiteSpace(existing))
            scores = JsonSerializer.Deserialize<List<ScoreRecord>>(existing) ?? new();
    }

    scores.Add(new ScoreRecord(
        Guid.NewGuid().ToString(),
        submission.EmployeeName,
        submission.CategoryId,
        submission.Correct,
        submission.Total,
        submission.Lang,
        DateTime.UtcNow
    ));

    await File.WriteAllTextAsync(scoresPath, JsonSerializer.Serialize(scores, jsonOptions));
    return Results.Ok(new { status = "saved" });
});

// GET /api/scores
// Returns every recorded score — useful for an admin overview or export to Excel.
app.MapGet("/api/scores", async () =>
{
    var scoresPath = DataPath("scores.json");
    if (!File.Exists(scoresPath))
        return Results.Ok(new List<ScoreRecord>());

    return Results.Text(await File.ReadAllTextAsync(scoresPath), "application/json");
});

app.Run();

record ScoreSubmission(string EmployeeName, string CategoryId, int Correct, int Total, string Lang);

record ScoreRecord(
    string Id,
    string EmployeeName,
    string CategoryId,
    int Correct,
    int Total,
    string Lang,
    DateTime Timestamp
);
