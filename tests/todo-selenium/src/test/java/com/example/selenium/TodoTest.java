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
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;

public class TodoTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5174");

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        if (System.getProperty("headless", "false").equalsIgnoreCase("true")) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-debugging-port=0");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-background-networking");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }

    // Runs before every test — cleans existing tasks so each test starts fresh
    @BeforeMethod
    public void cleanupBeforeTest() {
        driver.get(BASE_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("delete-all-btn")));
        driver.findElement(By.id("delete-all-btn")).click();
        // Wait until table is empty (either empty state msg or 0 rows)
        wait.until(driver -> driver.findElements(By.xpath("//tbody/tr")).size() == 0);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private void addTask(String title) {
        WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));
        input.clear();
        input.sendKeys(title);
        driver.findElement(By.id("add-todo-btn")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(text(),'" + title + "')]")));
    }

    // ─── Test 1: Add a new todo ───────────────────────────────────────────────

    @Test(priority = 1)
    public void addTodo() {
        String title = "Selenium - Buy groceries";

        WebElement input = driver.findElement(By.id("todo-input"));
        input.sendKeys(title);
        driver.findElement(By.id("add-todo-btn")).click();

        // Wait for React to re-render and clear the input
        wait.until(ExpectedConditions.attributeToBe(By.id("todo-input"), "value", ""));

        Assert.assertTrue(
                driver.getPageSource().contains(title),
                "Added task should appear in the table."
        );
        Assert.assertEquals(
                driver.findElement(By.id("todo-input")).getAttribute("value"),
                "",
                "Input field should be empty after adding a task."
        );

        System.out.println("PASS addTodo — task visible and input cleared");
    }

    // ─── Test 2: Delete a single todo ────────────────────────────────────────

    @Test(priority = 2)
    public void deleteTodo() {
        String title = "Selenium - Call the bank";

        addTask(title);

        driver.findElement(
                By.xpath("//tr[.//td[contains(text(),'" + title + "')]]//i[contains(@class,'fa-trash')]")
        ).click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//td[contains(text(),'" + title + "')]")));

        Assert.assertFalse(
                driver.getPageSource().contains(title),
                "Deleted task should not appear in the table."
        );

        System.out.println("PASS deleteTodo — task removed from list");
    }

    // ─── Test 3: Mark a todo as completed ────────────────────────────────────

    @Test(priority = 3)
    public void completeTodo() {
        String title = "Selenium - Morning workout";

        addTask(title);

        WebElement row = driver.findElement(
                By.xpath("//tr[.//td[contains(text(),'" + title + "')]]"));
        WebElement checkbox = row.findElement(By.xpath(".//input[@type='checkbox']"));

        Assert.assertFalse(checkbox.isSelected(), "Checkbox should be unchecked initially.");

        checkbox.click();

        wait.until(ExpectedConditions.attributeContains(row, "class", "completedRow"));

        Assert.assertTrue(
                row.getAttribute("class").contains("completedRow"),
                "Row should have completedRow class after checking."
        );
        Assert.assertTrue(checkbox.isSelected(), "Checkbox should be checked after click.");

        System.out.println("PASS completeTodo — row marked as completed");
    }

    // ─── Test 4: Add a todo with a due date ──────────────────────────────────

    @Test(priority = 4)
    public void addTodoWithDueDate() {
        String title = "Selenium - Submit assignment";
        String date  = "2026-12-31";

        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("todo-input")));
        driver.findElement(By.id("todo-input")).sendKeys(title);
        driver.findElement(By.id("todo-due-date")).sendKeys(date);
        driver.findElement(By.id("add-todo-btn")).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(text(),'" + title + "')]")));

        WebElement row = driver.findElement(
                By.xpath("//tr[.//td[contains(text(),'" + title + "')]]"));

        Assert.assertTrue(
                row.getText().contains(title),
                "Task title should appear in the row."
        );

        List<WebElement> cells = row.findElements(By.tagName("td"));
        String dueDateCell = cells.get(2).getText();
        Assert.assertNotEquals(dueDateCell, "-", "Due date cell should not be '-' when a date was set.");

        System.out.println("PASS addTodoWithDueDate — due date visible in table: " + dueDateCell);
    }

    // ─── Test 5: Delete all todos ─────────────────────────────────────────────

    @Test(priority = 5)
    public void deleteAllTodos() {
        addTask("Selenium - Bulk task one");
        addTask("Selenium - Bulk task two");

        List<WebElement> rowsBefore = driver.findElements(By.xpath("//tbody/tr"));
        Assert.assertTrue(rowsBefore.size() >= 2, "At least 2 tasks should be in the table before Delete All.");

        driver.findElement(By.id("delete-all-btn")).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[contains(text(),'No tasks yet')]")));

        Assert.assertTrue(
                driver.getPageSource().contains("No tasks yet"),
                "Empty state message should appear after deleting all tasks."
        );

        List<WebElement> rowsAfter = driver.findElements(By.xpath("//tbody/tr"));
        Assert.assertEquals(rowsAfter.size(), 0, "Table should have zero rows after Delete All.");

        System.out.println("PASS deleteAllTodos — all tasks cleared, empty state shown");
    }

    // ─── Test 6: Empty input validation (boundary) ───────────────────────────

    @Test(priority = 6)
    public void emptyInputValidation() {
        // @BeforeMethod already cleaned up — table is empty, just click Add
        driver.findElement(By.id("add-todo-btn")).click();

        try { Thread.sleep(800); } catch (InterruptedException ignored) {}

        List<WebElement> rows = driver.findElements(By.xpath("//tbody/tr"));
        Assert.assertEquals(rows.size(), 0,
                "No task should be added when the title input is empty.");

        Assert.assertTrue(
                driver.getPageSource().contains("No tasks yet"),
                "Empty state message should still be visible after submitting blank input."
        );

        System.out.println("PASS emptyInputValidation — blank input correctly rejected");
    }
}
