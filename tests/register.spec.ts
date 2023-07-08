import { test, expect } from '@playwright/test';
import Fastify from 'fastify'

test('shows title', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page.locator('main')).toHaveText('Welcome to Sphinx')
});

test('register a new endpoint', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('text=Register endpoint').click()

    await page.locator('text=Name').fill('Luke')
    await page.locator('text=URL').fill('http://localhost:6000')
    await page.locator('text=Create').click()

    await expect(page.locator('text=Luke')).toBeVisible()
    await expect(page.locator('text=http://localhost:6000')).toBeVisible()
});

test('score goes down after question answer times out', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('text=Register endpoint').click()

    await page.locator('text=Name').fill('Luke')
    await page.locator('text=URL').fill('http://localhost:6000')
    await page.locator('text=Create').click()
    
    await page.locator('text=Ask a question').click()

    await expect(page.locator('text=-10')).toBeVisible()
});

test('score goes up after question answer passed', async ({ page }) => {
    const fastify = Fastify({
        logger: true
    })

    fastify.get('/', async (request, reply) => {
        reply.type('application/json').code(200)
        return { correct: 'true' }
    })
      
    fastify.listen({ port: 6000 }, (err, address) => {
        if (err) throw err
        console.log(`Server is now listening on ${address}`);
    })

    await page.goto('http://localhost:3000');

    await page.locator('text=Register endpoint').click()

    await page.locator('text=Name').fill('Luke')
    await page.locator('text=URL').fill('http://localhost:6000')
    await page.locator('text=Create').click()
    
    await page.locator('text=Ask a question').click()

    await expect(page.getByText('10', { exact: true })).toBeVisible();

    await fastify.close()
});

test('score goes down after question answer fails', async ({ page }) => {
    const fastify = Fastify({
        logger: true
    })
    
    fastify.get('/', async (request, reply) => {
        reply.type('application/json').code(200)
        return { correct: 'false' }
    })
      
    fastify.listen({ port: 6000 }, (err, address) => {
        if (err) throw err
        console.log(`Server is now listening on ${address}`);
    })

    await page.goto('http://localhost:3000');

    await page.locator('text=Register endpoint').click()

    await page.locator('text=Name').fill('Luke')
    await page.locator('text=URL').fill('http://localhost:6000')
    await page.locator('text=Create').click()
    
    await page.locator('text=Ask a question').click()

    await expect(page.getByText('-10', { exact: true })).toBeVisible();

    fastify.close()
});
