package tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.Test;
import utils.ScreenshotUtils;

public class RegistrationTest extends BaseTest {

    private final String APP_PATH = "../frontend/index.html";

    @Test(priority = 1)
    public void testNegativeScenario_MissingLastName() {
        navigateToApp(APP_PATH);
        System.out.println("URL: " + driver.getCurrentUrl());
        System.out.println("Title: " + driver.getTitle());

        driver.findElement(By.id("firstName")).sendKeys("Jane");
        // Skipping Last Name
        driver.findElement(By.id("email")).sendKeys("jane.doe@example.com");
        driver.findElement(By.id("phone")).sendKeys("1234567890");
        driver.findElement(By.id("genderMale")).click();

        new Select(driver.findElement(By.id("country"))).selectByValue("USA");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("confirmPassword")).sendKeys("Test@1234");
        driver.findElement(By.id("terms")).click();

        WebElement submit = driver.findElement(By.id("submitBtn"));
        Assert.assertFalse(submit.isEnabled(), "Submit button should be disabled when Last Name is missing");

        // Trigger validation by typing and clearing
        WebElement ln = driver.findElement(By.id("lastName"));
        ln.sendKeys("temp");
        ln.clear();
        ln.sendKeys("\t"); // Tab out to trigger blur

        WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("lastNameError")));
        Assert.assertEquals(error.getText(), "Field is required");

        ScreenshotUtils.captureScreenshot(driver, "negative_missing_lastname");
    }

    @Test(priority = 2)
    public void testPositiveScenario_FullRegistration() {
        navigateToApp(APP_PATH);

        driver.findElement(By.id("firstName")).sendKeys("Jane");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("email")).sendKeys("jane.doe@proqa.com");

        new Select(driver.findElement(By.id("country"))).selectByValue("IN");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("state")));
        new Select(driver.findElement(By.id("state"))).selectByValue("Karnataka");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("city")));
        new Select(driver.findElement(By.id("city"))).selectByValue("Bangalore");

        driver.findElement(By.id("phone")).sendKeys("9876543210");
        driver.findElement(By.id("genderFemale")).click();
        driver.findElement(By.id("password")).sendKeys("Strong@123!");
        driver.findElement(By.id("confirmPassword")).sendKeys("Strong@123!");
        driver.findElement(By.id("terms")).click();

        WebElement submit = driver.findElement(By.id("submitBtn"));
        Assert.assertTrue(submit.isEnabled(), "Submit button should be enabled for valid data");
        submit.click();

        WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("successMessage")));
        Assert.assertTrue(success.isDisplayed(), "Success message should be visible");

        ScreenshotUtils.captureScreenshot(driver, "positive_registration_success");
    }

    @Test(priority = 3)
    public void testFormLogicValidation() {
        navigateToApp(APP_PATH);

        // 1. Validate Dropdown Logic
        Select country = new Select(driver.findElement(By.id("country")));
        country.selectByValue("USA");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("state")));
        Select state = new Select(driver.findElement(By.id("state")));
        Assert.assertFalse(state.getOptions().isEmpty(), "States should be populated for USA");

        country.selectByValue("IN");
        wait.until(ExpectedConditions.textToBePresentInElement(driver.findElement(By.id("state")), "Karnataka"));
        state.selectByValue("Karnataka");

        // 2. Validate Password Strength
        WebElement password = driver.findElement(By.id("password"));
        WebElement strengthText = driver.findElement(By.id("strengthText"));

        password.sendKeys("abc");
        Assert.assertEquals(strengthText.getText(), "Weak");
        password.sendKeys("Abc123!");
        Assert.assertEquals(strengthText.getText(), "Strong");

        // 3. Validate Mismatched Password
        password.clear();
        password.sendKeys("Match123");
        driver.findElement(By.id("confirmPassword")).sendKeys("NoMatch");
        WebElement confirmError = driver.findElement(By.id("confirmPasswordError"));
        Assert.assertEquals(confirmError.getText(), "Passwords do not match");

        // 4. Validate Submit Button remains disabled
        WebElement submit = driver.findElement(By.id("submitBtn"));
        Assert.assertFalse(submit.isEnabled(), "Submit button should be disabled for invalid form state");

        ScreenshotUtils.captureScreenshot(driver, "logic_validation_state");
    }
}
