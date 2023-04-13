import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://frontend-project-11-nine-nu.vercel.app/');
  await page.getByPlaceholder('ссылка RSS').click();
  await page.getByPlaceholder('ссылка RSS').fill('invalid link');
  await page.getByRole('button', { name: 'add' }).click();

  // Проверка на валидность
  await expect(page.getByText('Ссылка должна быть валидным URL')).toBeVisible();
  await expect(page.locator('#posts')).toBeEmpty();
  await expect(page.locator('#feeds')).toBeEmpty();

  await page.getByPlaceholder('ссылка RSS').click();
  await page.getByPlaceholder('ссылка RSS').fill('https://ru.hexlet.io/lessons.rss');
  await page.getByRole('button', { name: 'add' }).click();

  // Проверка что посты загрузились
  await expect(page.locator('#posts')).not.toBeEmpty();
  await expect(page.locator('#feeds')).not.toBeEmpty();
  // Проверка на вывод модали
  await page.locator('button[data-id="1"]').click();

  await expect(page.locator('.modal-dialog')).toBeVisible();

  await page.getByRole('button', { name: 'Закрыть' }).click();

  await expect(page.locator('.modal-dialog')).toBeVisible();

  // Проверка на невалидный RSS
  await page.getByPlaceholder('ссылка RSS').click();
  await page.getByPlaceholder('ссылка RSS').fill('https://ru.hexlet.io');
  await page.getByRole('button', { name: 'add' }).click();

  await expect(page.locator('#feedback')).toHaveText('Ресурс не содержит валидный RSS');
});
