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
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class TodoTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5174");

    @BeforeMethod
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        String headlessProp = System.getProperty("headless", "true");
        if (headlessProp.equalsIgnoreCase("true")) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * Test Case 1: Add a new todo task and verify it appears in the list.
     */
    @Test
    public void addTodo() {
        String taskTitle = "Task added with selenium";

        driver.get(BASE_URL);
        System.out.println("Navigating to: " + BASE_URL);

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));

        WebElement input = driver.findElement(By.id("todo-input"));
        input.sendKeys(taskTitle);

        WebElement addBtn = driver.findElement(By.id("add-todo-btn"));
        addBtn.click();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        Assert.assertTrue(
                driver.getPageSource().contains(taskTitle),
                "Expected task '" + taskTitle + "' to appear in the todo list after adding."
        );

        System.out.println("addTodo PASSED — task found in list: " + taskTitle);
    }

    /**
     * Test Case 2: Add a todo task and then delete it; verify it disappears from the list.
     */
    @Test
    public void deleteTodo() {
        String taskTitle = "Task Deleted with selenium";
        driver.get(BASE_URL);
        System.out.println("Navigating to: " + BASE_URL);

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));

        WebElement input = driver.findElement(By.id("todo-input"));
        input.sendKeys(taskTitle);
        driver.findElement(By.id("add-todo-btn")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        Assert.assertTrue(
                driver.getPageSource().contains(taskTitle),
                "Task should be present before deletion."
        );

        WebElement deleteIcon = driver.findElement(
                By.xpath("//tr[.//td[contains(., '" + taskTitle + "')]]//i[contains(@class,'fa-trash')]"));
        deleteIcon.click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//td[contains(., '" + taskTitle + "')]")));

        Assert.assertFalse(
                driver.getPageSource().contains(taskTitle),
                "Expected task '" + taskTitle + "' to be removed after deletion."
        );

        System.out.println("deleteTodo PASSED — task removed from list: " + taskTitle);
    }
}
