import { testRoot } from './utils';

export async function getSharedUser(page) {
    const password = 'testtest';
    const username = 'testuser';
    const email = 'testuser@lighterpack.com';

    const response = await page.request.post(`${testRoot}register`, {
        data: { username, password, email },
    });

    if (response.ok()) {
        return { username, password, email };
    }

    if (response.status() === 400) {
        const body = await response.json().catch(() => null);
        const errors = body?.errors || [];
        const duplicateError = errors.some((error) => (
            error.field === 'username' || error.field === 'email'
        ));

        if (duplicateError) {
            return { username, password, email };
        }
    }

    throw new Error(`Failed to create shared user ${username}: ${response.status()} ${await response.text()}`);
}

export async function registerUser(page, username, password, email) {
    await page.goto(testRoot);
  
    await page.fill('.lpRegister input[name="username"]', username);
    await page.fill('.lpRegister input[name="email"]', email);
    await page.fill('.lpRegister input[name="password"]', password);
    await page.fill('.lpRegister input[name="passwordConfirm"]', password);
    await page.getByRole('button').filter({hasText: 'Register'}).click();
}

export async function loginUser(page, username, password) {
    await page.goto(testRoot);
  
    await page.fill('.signin input[name="username"]', username);
    await page.fill('.signin input[name="password"]', password);
    await page.getByRole('button').filter({hasText: 'Sign in'}).click();
}

export async function logoutUser(page) { 
    await page.getByText('Signed in as').hover();
    await page.getByText('Sign out').click();
}