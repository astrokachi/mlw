import { Response } from "express";
import { AppError } from "./appError";
import Logger from "../log/logger";

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
    Logger.error(" trusted error", error);
  }

  private handleCriticalError(
    error: Error | AppError,
    response?: Response
  ): void {
    let err: any = { ...error };

    if (response) {
      if (err.name === "SequelizeUniqueConstraintError") {
        response.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          message: "Internal server error",
          error: err.parent?.detail,
        });
      } else {
        response
          .status(HttpCode.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal server error", error: error.message });
      }
    }

    Logger.error(
      "Application encountered a critical error. Exiting",
      err.parent?.detail || error
    );
  }
}

export const errorHandler = new ErrorHandler();
