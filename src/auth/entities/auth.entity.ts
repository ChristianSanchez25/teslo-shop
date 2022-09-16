import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ unique: true, type: 'varchar', length: 255 })
    email: string;
    
    @ApiProperty()
    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 100 })
    fullName: string;

    @ApiProperty()
    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @ApiProperty()
    @Column({ type: 'varchar', array: true, default: ['user'] })
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }   
    
}
