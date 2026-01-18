import { test, expect, Page } from '@playwright/test'

//TODO::Includere un before each che controlla se il file .env è presente, sennò stampa un messaggio di errore e interrompe qualsiasi test

const env_entries = [
  "E2E_USERNAME",
  "E2E_PASSWORD",
  "BASE_HOST"
]

test.beforeAll('check if there is env file', async () => {
  const missing = env_entries.filter(e => !process.env[e]);

  if (missing.length > 0) {
    throw new Error(`Variabili d'ambiente mancanti: ${missing.join(', ')}`);
  }
});

async function authenticateUser(page: Page, host: string, user: string, password: string) {
  await page.goto(host)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(password)
  await page.getByRole('button', { name: 'Accedi' }).click()
}

test('should login with correct credentials', async ({ page }) => {
  authenticateUser(page, process.env.BASE_HOST!, process.env.E2E_USERNAME!, process.env.E2E_PASSWORD!)
  const header = page.locator('header')
  await expect(header).toBeVisible()
  await expect(header).toContainText(`Benvenuto, ${process.env.E2E_USERNAME!}`)
})

test('should prevent login with incorrect credentials', async ({ page }) => {
  authenticateUser(page, process.env.BASE_HOST!, process.env.E2E_USERNAME!, "randompass")
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("Oops! Credenziali non valide")
})

test('should log out correctly', async ({ page }) => {
  authenticateUser(page, process.env.BASE_HOST!, process.env.E2E_USERNAME!, process.env.E2E_PASSWORD!)
  const header = page.locator('header')
  await expect(header).toBeVisible()
  await expect(header).toContainText(`Benvenuto, ${process.env.E2E_USERNAME!}`)
  await page.getByText("logout").click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText(`Torna presto, ${process.env.E2E_USERNAME!}!`)
})


test('should register user with correct credentials', async ({ page }) => {
const user = "newtestuser"
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.locator('app-authentication-page').getByRole('link', { name: 'Registrati' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Registrati' }).click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText(`Congratulazioni ${user}!`)
})

test('should prevent registering user with empty fields', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.locator('app-authentication-page').getByRole('link', { name: 'Registrati' }).click()
  await page.getByRole('button', { name: 'Registrati' }).click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("I dati forniti non sono validi!")
  
  const form = page.locator('app-register-page form');
  await expect(
    page.getByText('Inserisci uno username.')
  ).toBeVisible();
  await expect(
    page.getByText('Inserisci una password.')
  ).toBeVisible();
})

test('should display message user already exists', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.locator('app-authentication-page').getByRole('link', { name: 'Registrati' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Registrati' }).click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("L'username selezionato già esiste")
})

test('should register cat correctly', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.locator('header').getByRole('link', { name: 'Inserisci un randagio' }).click()
  await page.locator('input[type="file"]').setInputFiles('tests/images/cat.jpeg')
  await page.getByPlaceholder('Inserisci un titolo...').fill("Gatto di test")
  await page.getByPlaceholder('Scrivi qui in markdown...').fill(`
    # Test

    **gatto di prova**.

    ## Test list
    - prova
    - prova2
    - *prova3*

    ### gatto di prova
    Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit. 
    Nulla sagittis lectus lectus, 
    in vestibulum est aliquam et.

    > final test`)
  await page.locator('#catFormMap').click()  
  await page.locator("button[type='submit']").click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("Salvataggio completato!")
})

test('should prevent registering cat with empty fields', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.locator('header').getByRole('link', { name: 'Inserisci un randagio' }).click()
  await page.locator("button[type='submit']").click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("I dati forniti non sono validi!")

  const form = page.locator('app-cat-form form');
  await expect(
    page.getByText('Inserisci un titolo.')
  ).toBeVisible()
  await expect(
    page.getByText("Inserisci un'immagine.")
  ).toBeVisible()
    await expect(
    page.getByText('Inserisci una descrizione.')
  ).toBeVisible()
  await expect(
    page.getByText('Clicca sulla mappa per inserire la posizione del tuo randagio.')
  ).toBeVisible() 
})

test('should display file error message', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.getByPlaceholder('username').fill("admin")
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.locator('header').getByRole('link', { name: 'Inserisci un randagio' }).click()
  await page.locator('input[type="file"]').setInputFiles('tests/images/mushroom.png')
  await page.getByPlaceholder('Inserisci un titolo...').fill("Gatto di test")
  await page.getByPlaceholder('Scrivi qui in markdown...').fill("Test prova")
  await page.locator('#catFormMap').click()  
  await page.locator("button[type='submit']").click()
  const toast = page.locator('#toast-container')
  await expect(toast).toBeVisible()
  await expect(toast).toContainText("I dati forniti non sono validi!")
  const imageError = page.locator(".input-file-wrapper + div p")
  await expect(imageError).toBeVisible()
  await expect(imageError).toContainText("Il formato dell'immagine deve essere jpeg, jpg oppure webp")
})

test('should display new comment', async ({ page }) => {
  await page.goto(process.env.BASE_HOST!)
  await page.locator('header').getByRole('link', { name: 'Accedi' }).click()
  await page.getByPlaceholder('username').fill(user)
  await page.getByPlaceholder('password').fill(process.env.E2E_PASSWORD!)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.locator('.leaflet-marker-icon').first().click()
  await page.locator('.leaflet-popup-content a').click()
})