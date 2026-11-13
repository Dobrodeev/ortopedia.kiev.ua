import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PageService } from '../pages/page.service';

/** Віддає оформлену сторінку 404 замість JSON-відповіді */
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  constructor(private readonly pages: PageService) {}

  async catch(_exception: NotFoundException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const locals = await this.pages.locals({
      path: req.path,
      title: 'Сторінку не знайдено — Ортопедія VIP',
      description: 'Сторінку не знайдено.',
      noindex: true,
    });
    res.status(404).render('pages/404', locals);
  }
}
