import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'varchar', length: 255 })
    email: string;
    
    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    fullName: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

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
