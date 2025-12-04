import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findAll() {
    return this.userModel.find().select('-password').exec(); // Oculta senha
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const dataToUpdate = { ...updateUserDto };

    // Se o usuário mandou senha nova, precisamos criptografar de novo
    if (dataToUpdate.password) {
      const salt = await bcrypt.genSalt();
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true }) // new: true retorna o objeto já atualizado
      .select('-password') // Não devolve a senha hash no retorno
      .exec();

    if (!updatedUser) throw new NotFoundException('Usuário não encontrado');
    return updatedUser;
  }

  async updateAvatar(id: string, photo: string) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { photo }, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) throw new NotFoundException('Usuário não encontrado');
    return updatedUser;
  }

  async remove(id: string, password?: string) {
    if (!password) {
      throw new UnauthorizedException('Senha é obrigatória para excluir a conta');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    await this.userModel.findByIdAndDelete(id).exec();
    return { message: 'Usuário removido com sucesso' };
  }
}