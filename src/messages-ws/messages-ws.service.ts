import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';


interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User};
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    private connectedClients: ConnectedClients = {};

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User is not active');
        this.checkUserIsConnected(user)
        this.connectedClients[client.id] = {
            socket: client,
            user: user 
        };
    }

    removeClient(client: Socket) {
        delete this.connectedClients[client.id];
    }

    getConnectedClients():string[] {
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string):string{
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserIsConnected(user : User): void {
        for (const socketId of Object.keys(this.connectedClients)) {
            const connectedUser = this.connectedClients[socketId];
            if (connectedUser.user.id === user.id) {
                connectedUser.socket.disconnect();
                break;
            }
        }

    }


}
