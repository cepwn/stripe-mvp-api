import { InternalServerErrorException } from '@nestjs/common';
import { validateSync, ValidatorOptions } from 'class-validator';

export abstract class ValidatorReady {
  constructor(record: Record<string, any>) {
    Object.assign(this, record);
    this.validate();
  }

  public validate = (validatorOptions?: ValidatorOptions): void => {
    const errors = validateSync(this, validatorOptions);
    if (errors.length > 0) {
      throw new InternalServerErrorException(errors);
    }
  };
}
