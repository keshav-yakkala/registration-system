# Intelligent Registration System with Smart Client-Side Validation and Selenium Automation

## 🚀 Project Overview
This project is an industry-grade Registration System designed with a focus on **testability**, **validation logic**, and **automated quality assurance**. It demonstrates a robust frontend implementation paired with a professional Selenium automation suite in Java.

## 📂 Project Structure
- `frontend/`: Contains the source code for the registration interface.
  - `index.html`: Semantic, accessible structure with meaningful IDs for automation.
  - `style.css`: Premium Glassmorphism UI with responsive design.
  - `script.js`: Advanced validation logic (disposable email blocking, country-specific phone rules, etc.).
- `automation/`: Selenium WebDriver test suite in Java.
  - `src/test/java/tests/`: Registration and Base test classes.
  - `src/test/java/utils/`: Reusable utilities like `ScreenshotUtils`.
- `screenshots/`: Automated test execution screenshots.
- `reports/`: Professional QA test reports.

## ✨ Key Features
- **Smart Validation**: Blocks disposable email domains and enforces country-specific phone number lengths.
- **Dynamic Logic**: Dependent Country → State → City dropdowns.
- **Security**: Real-time password strength meter and confirm password matching.
- **Automation Ready**: Stable locators and predictable state transitions for reliable Selenium tests.

## 🛠️ Setup & Execution

### Prerequisites
- **Java 11+**
- **Maven 3.6+**
- **Google Chrome** (latest version)

### Frontend
Simply open `frontend/index.html` in any modern web browser.

### Automation Tests
1. Navigate to the `automation/` directory.
2. Run the following command:
   ```bash
   mvn test
   ```
3. Test results will be displayed in the console, and screenshots will be saved in the root `screenshots/` directory.

## 🤖 AI Usage & Ethics
This project leverages AI-assisted development (Google Gemini) for boilerplate generation and code optimization. 
- **Human-in-the-loop**: All validation rules, test scenarios, and architecture decisions were reviewed and refined by a senior engineer.
- **Responsibility**: AI was used to accelerate development while ensuring code quality and best practices were maintained through manual oversight.

## 📝 Author
**ProQA Team** - *Committed to Quality-by-Design.*
