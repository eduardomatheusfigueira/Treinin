from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:3000/#/login")
    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Password").fill("password")
    page.get_by_role("button", name="Login").click()

    # Wait for navigation to the dashboard
    expect(page).to_have_url("http://localhost:3000/#/")

    # --- Skills Dashboard ---
    page.screenshot(path="jules-scratch/verification/dashboard-patinacao.png")

    # Switch to Calistenia tab
    page.get_by_role("button", name="Calistenia").click()
    page.wait_for_timeout(500) # Wait for tab to switch
    page.screenshot(path="jules-scratch/verification/dashboard-calistenia.png")

    # --- Skill Shop ---
    page.get_by_role("link", name="Explorar Habilidades").click()
    expect(page).to_have_url("http://localhost:3000/#/skill-shop")

    # Screenshot of Patinação in shop
    page.screenshot(path="jules-scratch/verification/shop-patinacao.png")

    # Switch to Calistenia tab in shop
    page.get_by_role("button", name="Calistenia").click()
    page.wait_for_timeout(500) # Wait for tab to switch
    page.screenshot(path="jules-scratch/verification/shop-calistenia.png")

    # --- Add new sport ---
    page.get_by_role("button", name="Novo Esporte").click()
    page.get_by_placeholder("Nome do novo esporte").fill("Yoga")
    page.get_by_role("button", name="Salvar Esporte").click()
    page.wait_for_timeout(500)
    page.screenshot(path="jules-scratch/verification/shop-new-sport.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)