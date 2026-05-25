package com.example.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

public class TodoTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5174");

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        String headlessProp = System.getProperty("headless", "false");
        if (headlessProp.equalsIgnoreCase("true")) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * Test Case 1: Add a new todo and verify it appears in the list.
     */
    @Test
    public void addTodo() {
        String taskTitle = "Selenium - Buy groceries";

        driver.get(BASE_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));

        driver.findElement(By.id("todo-input")).sendKeys(taskTitle);
        driver.findElement(By.id("add-todo-btn")).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        Assert.assertTrue(
                driver.getPageSource().contains(taskTitle),
                "Task should appear in the list after adding."
        );
        System.out.println("addTodo PASSED — task visible: " + taskTitle);
    }

    /**
     * Test Case 2: Add a task then delete it and verify it is gone.
     */
    @Test
    public void deleteTodo() {
        String taskTitle = "Selenium - Call the bank";

        driver.get(BASE_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));

        driver.findElement(By.id("todo-input")).sendKeys(taskTitle);
        driver.findElement(By.id("add-todo-btn")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        driver.findElement(
                By.xpath("//tr[.//td[contains(., '" + taskTitle + "')]]//i[contains(@class,'fa-trash')]")
        ).click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        Assert.assertFalse(
                driver.getPageSource().contains(taskTitle),
                "Task should be removed after deletion."
        );
        System.out.println("deleteTodo PASSED — task removed: " + taskTitle);
    }
}
