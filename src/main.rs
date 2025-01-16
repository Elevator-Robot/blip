use aws_sdk_bedrockruntime::types::{Body, MessageRequest};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load AWS configuration
    let config = aws_config::load_from_env().await;
    let client = aws_sdk_bedrockruntime::Client::new(&config);

    // Prepare the message for Claude
    let messages = vec![MessageRequest::builder()
        .role("user")
        .content("Tell me a short joke about programming.")
        .build()];

    let request = json!({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "messages": messages,
    });

    // Create the invoke model request
    let response = client
        .invoke_model()
        .model_id("anthropic.claude-3-sonnet-20240229-v1:0")
        .body(Body::from(request.to_string()))
        .content_type("application/json")
        .send()
        .await?;

    // Parse and print the response
    if let Some(body) = response.body {
        let response_str = String::from_utf8(body.into_inner())?;
        let response_json: Value = serde_json::from_str(&response_str)?;
        
        if let Some(content) = response_json["content"].as_array() {
            if let Some(first_message) = content.first() {
                if let Some(text) = first_message["text"].as_str() {
                    println!("Claude's response: {}", text);
                }
            }
        }
    }

    Ok(())
}
