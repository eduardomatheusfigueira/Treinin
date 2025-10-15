import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        # Mock Google Sign-In
        await context.add_init_script("""
            window.mockUser = {
                uid: 'test-uid',
                displayName: 'Test User',
                email: 'test@example.com',
            };
            window.signInWithPopup = () => Promise.resolve({ user: window.mockUser });
            window.onAuthStateChanged = (auth, callback) => {
                callback(window.mockUser);
                return () => {};
            };
        """)

        page = await context.new_page()
        await page.goto("http://localhost:3000/#/login")

        # Since we're mocking, the sign-in button click might not be necessary,
        # but we'll include it for completeness.
        await page.click('button:has-text("Sign in with Google")')

        # Wait for navigation to the dashboard
        await page.wait_for_url("http://localhost:3000/#/")

        # Add a new skill
        await page.click('button:has-text("Adicionar Habilidade")')
        await page.fill('input[placeholder="Nome da Habilidade"]', "Test Skill")
        await page.click('button:has-text("Salvar")')

        # Verify the skill was added
        await expect(page.locator('h3:has-text("Test Skill")')).to_be_visible()

        await page.screenshot(path="jules-scratch/verification/verification.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())