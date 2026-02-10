package com.anthropic.articleservice.repository;

import com.anthropic.articleservice.model.Article;
import com.anthropic.articleservice.model.Article.Section;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ArticleRepository {

    private final Map<String, Article> articles = new HashMap<>();

    public ArticleRepository() {
        initializeArticles();
    }

    private void initializeArticles() {
        // Claude Opus 4.6 Article
        articles.put("claude-opus-4-6", new Article(
            "claude-opus-4-6",
            "Claude Opus 4.6",
            "Intelligent, efficient, and the best model in the world for coding, agents, and computer use",
            "February 5, 2026",
            "Product",
            "Our newest model excels at coding and computer use while improving everyday tasks like research and spreadsheet work.",
            "Anthropic",
            "Product Team",
            "/images/opus-page.png",
            "Claude Opus 4.6 announcement graphic",
            10,
            List.of("AI", "Claude", "Product Launch", "Machine Learning"),
            List.of(
                Section.paragraph("Today we're releasing Claude Opus 4.6—intelligent, efficient, and the best model in the world for coding, agents, and computer use. The model also excels at research tasks and spreadsheet work, making it our most capable model for both specialized and everyday applications."),
                Section.heading("State-of-the-Art Software Engineering"),
                Section.paragraph("Opus 4.6 achieves state-of-the-art results on SWE-bench Verified, outperforming all competing frontier models on real-world software engineering tasks. The model scored higher than any human candidate on Anthropic's internal engineering exam within a 2-hour timeframe, demonstrating exceptional coding ability."),
                Section.heading("Multilingual Coding Excellence"),
                Section.paragraph("The model leads across 7 of 8 programming languages on SWE-bench Multilingual and demonstrates a 10.6% improvement over Sonnet 4.5 on Aider Polyglot benchmarks, showing its versatility across the programming landscape."),
                Section.heading("Efficiency Without Compromise"),
                Section.paragraph("At medium effort levels, Opus 4.6 matches Sonnet 4.5's performance while using 76% fewer output tokens. At maximum effort, it exceeds Sonnet by 4.3 percentage points while consuming 48% fewer tokens—delivering better results at lower cost."),
                Section.heading("The Effort Parameter"),
                Section.paragraph("Developers can now adjust the model's reasoning depth using the new effort parameter, choosing between speed/cost optimization or maximum capability depending on their use case. This gives unprecedented control over the compute-quality tradeoff."),
                Section.heading("Extended Conversations"),
                Section.paragraph("Claude app users can maintain longer conversations without hitting context walls through automatic summarization, enabling more complex multi-turn interactions and sustained collaborative work."),
                Section.heading("Computer Use & Multi-Agent Coordination"),
                Section.paragraph("Opus 4.6 shows significantly improved performance handling spreadsheets, browser tasks, and desktop applications. It also effectively manages teams of subagents for complex workflows, making it ideal for sophisticated automation tasks."),
                Section.quote("Opus 4.6 figures out the fix when pointed at complex, multi-system bugs."),
                Section.heading("Safety & Alignment"),
                Section.paragraph("Opus 4.6 represents the most robustly aligned model we have released. It demonstrates substantial resistance to prompt injection attacks compared to other frontier models, providing stronger security guarantees for production deployments."),
                Section.heading("Pricing & Availability"),
                Section.paragraph("The model is available at $5/$15 per million input/output tokens via the Claude API (model ID: claude-opus-4-6-20251101). It's accessible on Claude.ai, the developer platform, and all three major cloud providers—AWS, Google Cloud, and Microsoft Azure."),
                Section.heading("Product Ecosystem Updates"),
                Section.list(List.of(
                    "Claude Code: Now features improved Plan Mode with upfront clarification and editable planning documents, available on desktop",
                    "Chrome Extension: Full rollout to Max users for seamless browser integration",
                    "Excel Integration: Expanded beta access for Max, Team, and Enterprise subscribers",
                    "Conversation Management: Removed Opus-specific usage caps for Max and Team Premium tiers"
                ))
            )
        ));

        // Economic Index Article
        articles.put("economic-index", new Article(
            "economic-index",
            "The Anthropic Economic Index",
            "Revealing the shape of AI adoption across the world",
            "January 15, 2026",
            "Research",
            "Explore the data behind our research to understand how people are using Claude across every US state and hundreds of occupations.",
            "Anthropic Research",
            "Economics Research Team",
            "/images/econ-page.png",
            "Anthropic Economic Index dashboard visualization",
            12,
            List.of("Research", "Economics", "AI Impact", "Data Analysis"),
            List.of(
                Section.paragraph("The Anthropic Economic Index is a comprehensive tool for understanding AI's effects on the economy. It reveals the shape of AI adoption across the world, allowing users to explore how people are using Claude across every US state and hundreds of occupations."),
                Section.heading("Understanding AI Adoption Patterns"),
                Section.paragraph("Our index tracks regional AI adoption patterns by US state and occupational usage trends across hundreds of job categories. We also analyze topic trends specific to geographic locations and measure user preferences between augmentation (collaboration with AI) versus automation (delegation to AI)."),
                Section.heading("Dataset Information"),
                Section.list(List.of(
                    "Current Version: v4 (Release 01-15-2026)",
                    "Launch Date: January 15, 2026",
                    "Data available for download via Hugging Face",
                    "Covers Claude AI usage across Free and Pro tiers"
                )),
                Section.heading("Interactive Data Explorer"),
                Section.paragraph("The Economic Index Hub includes five tabs for comprehensive data exploration:"),
                Section.list(List.of(
                    "US Usage: Aggregate patterns across the United States",
                    "State Usage: Granular state-by-state analysis",
                    "Global Usage: Worldwide AI adoption trends",
                    "Country Usage: Country-specific metrics and comparisons",
                    "Job Explorer: Detailed occupational analysis across industries"
                )),
                Section.heading("Augmentation vs. Automation"),
                Section.paragraph("A key insight from the index is understanding how users choose between augmentation—where AI collaborates with and enhances human work—versus automation—where tasks are delegated entirely to AI. This distinction helps us understand the evolving relationship between human workers and AI tools."),
                Section.heading("Sample Insights"),
                Section.paragraph("The dataset reveals fascinating patterns across professional domains. For example, programming assistance tasks like debugging software code represent significant portions of requests in technology-focused regions, while financial guidance and analysis tasks dominate in business-oriented markets."),
                Section.heading("Access the Research"),
                Section.list(List.of(
                    "Read the full research report for methodology and findings",
                    "Download the complete dataset from Hugging Face for independent analysis",
                    "Use the interactive visualization interface to explore specific trends"
                )),
                Section.paragraph("The Anthropic Economic Index represents our commitment to transparency about AI's role in the economy and provides valuable data for researchers, policymakers, and businesses seeking to understand AI adoption patterns.")
            )
        ));

        // Building Effective Agents Article
        articles.put("building-effective-agents", new Article(
            "building-effective-agents",
            "Building Effective Agents",
            "Lessons learned from building LLM agents with dozens of teams",
            "December 19, 2025",
            "Engineering",
            "The most successful implementations use simple patterns rather than complex frameworks or specialized libraries.",
            "Anthropic Engineering",
            "Applied AI Team",
            "/images/agent-page.svg",
            "Diagram showing agent architecture patterns",
            15,
            List.of("Engineering", "Agents", "LLM", "Best Practices", "Architecture"),
            List.of(
                Section.paragraph("Over the past year, we've worked with dozens of teams building large language model (LLM) agents across industries. Consistently, the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."),
                Section.quote("The most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."),
                Section.heading("What Are Agentic Systems?"),
                Section.paragraph("\"Agentic systems\" encompasses two distinct architectural approaches. Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents, in contrast, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks."),
                Section.heading("When to Use Each Approach"),
                Section.paragraph("We recommend starting simple. For many applications, optimizing single LLM calls with retrieval and in-context examples is usually enough. Workflows offer predictability and consistency for well-defined tasks, while agents are better suited for open-ended problems requiring flexibility and model-driven decision-making at scale."),
                Section.heading("Building Block: The Augmented LLM"),
                Section.paragraph("The foundation of agentic systems is the augmented LLM—enhanced with retrieval, tools, and memory capabilities. Our current models can actively use these capabilities, generating their own search queries, selecting appropriate tools, and determining what information to retain."),
                Section.heading("Five Workflow Patterns"),
                Section.paragraph("These patterns progress from simple to complex:"),
                Section.list(List.of(
                    "Prompt Chaining: Decomposing tasks into a sequence of steps, where each LLM call processes the output of the previous one. You can add programmatic checks on intermediate outputs to ensure the process stays on track.",
                    "Routing: Classifying an input and directing it to a specialized followup task. This works well when there are distinct categories that are better handled separately.",
                    "Parallelization: Running tasks simultaneously, either by sectioning (breaking a task into independent subtasks) or voting (running the same task multiple times to get diverse outputs).",
                    "Orchestrator-Workers: A central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results.",
                    "Evaluator-Optimizer: One LLM call generates a response while another provides evaluation and feedback in a loop, enabling iterative refinement."
                )),
                Section.heading("Autonomous Agents"),
                Section.paragraph("Agents begin their work with either a command from, or interactive discussion with, the human user. Once the task is clear, agents plan and operate independently, potentially returning to the human for further information or judgment. During execution, it's crucial for agents to gain 'ground truth' from the environment at each step to assess its progress."),
                Section.heading("Three Core Principles"),
                Section.list(List.of(
                    "Maintain simplicity in your agent's design",
                    "Prioritize transparency by explicitly showing the agent's planning steps",
                    "Carefully craft your agent-computer interface (ACI) through thorough tool documentation and testing"
                )),
                Section.heading("Tool Design Best Practices"),
                Section.paragraph("Tools will likely be an important part of your agent. To create good tools, put yourself in the model's shoes and think about what makes an interface easy to use. Just as with human interfaces, you should invest effort into making agent-computer interfaces clear and well-documented. Include example usage, edge cases, and error prevention through thoughtful argument design."),
                Section.heading("Practical Applications"),
                Section.paragraph("Two domains show particularly strong results for agents:"),
                Section.list(List.of(
                    "Customer Support: Combining conversational AI with tool integration for data access and action execution. Success can be measured via resolution rates and user satisfaction.",
                    "Coding Agents: Software development agents that can solve real GitHub issues with verifiable, testable solutions. The ability to run tests provides clear success metrics."
                )),
                Section.quote("Tools will likely be an important part of your agent. Invest effort equal to HCI design in creating clear, well-documented agent-computer interfaces.")
            )
        ));
    }

    public Optional<Article> findById(String id) {
        return Optional.ofNullable(articles.get(id));
    }

    public List<Article> findAll() {
        return List.copyOf(articles.values());
    }
}
