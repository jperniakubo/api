import Boom from '@hapi/boom';
import {Response, NextFunction} from 'express';
import {OK, BAD_REQUEST} from 'http-status-codes';
import {FileArray} from 'express-fileupload';

import {CODE_OK, CODE_ERROR} from '../../resources/constants/codes.constant';
import {UploadAnyFiles} from '../../utils/UploadFiles';

export class ComplementResponse {
  // Complements
  getNewSlug = (content: any, path: string) => {
    let data: any;
    const response = content;
    if (Array.isArray(response.data)) {
      data = [];
      response.data.forEach((element: any) => {
        const component = this.getSpecificData(element, path);
        data.push(component);
      });
    } else {
      data = this.getSpecificData(response.data, path);
    }
    response.data = data;
    return response;
  };

  getSpecificData = (element: any, path: string) => {
    let slug: any;
    if (typeof element === 'object') {
      slug = element.get('slug');
    } else {
      slug = element.slug;
    }
    const routeFile =
      typeof path !== 'undefined' && path !== null ? `${path}/${slug}` : slug;
    element.set('slug', routeFile);
    return element;
  };

  singleFile(body: any, images: any) {
    // Data Base
    const uploadAnyFiles = new UploadAnyFiles();
    let slug = '';
    if (typeof body.dataValues === 'undefined') {
      slug = body.slug;
    } else {
      slug = body.get('slug');
    }

    if (typeof images !== 'undefined' && images !== null && images) {
      // Upload Files
      if (typeof images.upload !== 'undefined' && images.upload !== null) {
        if (images.upload) {
          // Upload File
          const routerTemp: string =
            typeof images.router !== 'undefined' && images.router !== null
              ? `${images.router}/${slug}`
              : slug;
          uploadAnyFiles.uploadFiles(images.files, routerTemp);
        }
      }
      // Update File
      if (typeof images.upload !== 'undefined' && images.upload !== null) {
        if (images.update) {
          // Remove Files
          const routerTemp: string = images.router ?? '';
          uploadAnyFiles.deleteFolderRecursive(routerTemp, slug);
        }
      }
      // List Elements
      if (typeof images.listAll !== 'undefined' && images.listAll !== null) {
        const files: any = uploadAnyFiles.getFiles(slug);
        if (typeof files !== 'undefined' && files !== null) {
          // eslint-disable-next-line no-param-reassign
          body.dataValues.files = files;
        }
      }

      if (
        typeof images.singleFile !== 'undefined' &&
        images.singleFile !== null
      ) {
        const file: any = uploadAnyFiles.getFile(slug);
        // eslint-disable-next-line no-console
        console.log(file, slug);
        if (typeof file !== 'undefined' && file !== null) {
          // eslint-disable-next-line no-param-reassign
          body.dataValues.file = file;
        }
      }
    }
  }

  returnData(
    response: Response,
    nextOrError: NextFunction,
    content: any,
    images:
      | {
          upload?: boolean;
          router?: string;
          files?: FileArray | undefined;
          update?: boolean;
          listAll?: boolean;
          singleFile?: boolean;
          pagination?: boolean;
        }
      | undefined = undefined,
    middleware: boolean = false
  ) {
    // Context Base
    let codeResponse = OK;
    let code = CODE_OK;
    // To send response
    let message: any;
    let body: any;
    if (typeof content === 'undefined' || !content || !content.status) {
      codeResponse = BAD_REQUEST;
      code = CODE_ERROR;
    }

    if (
      typeof content !== 'undefined' &&
      typeof content.message !== 'undefined' &&
      content.message
    ) {
      message = content.message;
    }
    if (typeof content !== 'undefined' && typeof content.data !== 'undefined') {
      body = content.data;

      if (
        typeof images !== 'undefined' &&
        typeof images.pagination !== 'undefined'
      ) {
        body = body.data;
      }

      if (Array.isArray(body)) {
        body.forEach((element: any) => {
          this.singleFile(element, images);
        });
      } else {
        this.singleFile(body, images);
      }
    }

    console.log('response generic', body);

    if (typeof body !== 'undefined' && typeof body.dataValues !== 'undefined') {
      console.log(body.dataValues);
    }

    if (!middleware) {
      response.status(codeResponse).json({
        success: codeResponse === OK,
        code,
        message,
        body
      });
    }

    if (
      typeof content !== 'undefined' &&
      typeof content.status !== 'undefined' &&
      !content.status
    ) {
      nextOrError(Boom.badRequest(message));
    }
  }
}
