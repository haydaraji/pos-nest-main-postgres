import { Injectable } from '@nestjs/common';
import { FindManyOptions, Like, getRepository } from 'typeorm';

@Injectable()
export class PageService {
  async generatePage(data, repo, opt: FindManyOptions = {}) {
    const { page, limit, ...where } = data;
    let strWhere = [];
    const strValue = [];
    if (where) {
      const filter = {};
      Object.keys(where).forEach((f) => {
        filter[f] = Like(`%${where[f]}%`);
      });
      strWhere = Object.keys(where);
      strWhere.forEach((f) => {
        strValue.push(where[f]);
      });
      opt.where = filter;
    }

    const bebas = strWhere.join();
    // const result = await repo.createQueryBuilder("Produk").where(where).;
    const result = await repo.find(opt);
    const total = await repo.count(opt);
    opt.skip = (data.page - 1) * data.limit;
    opt.take = data.limit;
    const pages = Math.ceil(total / data.limit);
    const finalData = {
      total: total,
      page: data.page,
      pages: pages,
      data: result,
    };
    return finalData;
  }
}
