from playwright.sync_api import sync_playwright, Page, expect

def verify_login_page(page: Page):
    """
    Este script verifica se a página de login foi redesenhada corretamente.
    """
    # 1. Navegue até a página de login
    page.goto("http://localhost:3000/login")

    # 2. Verifique se os novos elementos estão visíveis
    expect(page.locator(".login-container")).to_be_visible()
    expect(page.locator(".login-box")).to_be_visible()
    expect(page.locator(".logo-container")).to_be_visible()
    expect(page.get_by_role("heading", name="Bem-vindo de volta")).to_be_visible()
    expect(page.get_by_role("button", name="Entrar com o Google")).to_be_visible()

    # 3. Tire uma captura de tela
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_login_page(page)
        browser.close()

if __name__ == "__main__":
    main()