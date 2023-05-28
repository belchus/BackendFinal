require("dotenv").config();
const bcript = require("bcryptjs");
const { enviarMail } = require("../utils/nodemailer.js");
const logger = require("../utils/logger.js");
const main = require("../main.js");
const chatHandler = require('./chatMongo.js')
const chatModel = require('../models/chatModel.js')
const chat = new chatHandler(chatModel)

module.exports = class userHandler {
  constructor(model) {
    this.model = model;
  }

  userOnline(object) {
    main.userOnline = object.id;
    return { exito: `usuario ${object.id} activo` };
  }


  async getAll() {
    try {
      const data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getById(id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "usuario no encontrado" };
      } else {
        return data[0];
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getByMail(email) {
    try {
      const data = await this.model.find({ email: email });
      if (data.length == 0) {
        return { error: "usuario no encontrado" };
      } else {
        return data[0];
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async saveUser(data) {
    const user = await this.model.findOne({ email: data.email });
    if (user) {
      return { error: "ya hay alguien registrado con esas credenciales." };
    } else if (!data.firstname) {
      return { error: "este campo es obligatorio" };
    } else if (!data.lastname) {
      return { error: "este campo es obligatorio" };
    } else if (!data.age) {
      return { error: "este campo es obligatorio" };
    } else if (!data.address) {
      return { error: "este campo es obligatorio" };
    } else if (!data.phone) {
      return { error: "este campo es obligatorio" };
    } else if (!data.email) {
      return { error: "este campo es obligatorio" };
    } else if (!data.avatar) {
      return { error: "este campo es obligatorio" };
    } else if (!data.admin) {
      return { error: "este campo es obligatorio" };
    } else if (!data.password) {
      return { error: "este campo es obligatorio" };
    } else {
      try {
        const encript = await bcript.hash(data.password, 10);
        const newUser = {
          id: await this.getHighestId(),
          firstname: data.firstname,
          lastname: data.lastname,
          age: data.age,
          address: data.address,
          phone: data.phone,
          email: data.email,
          avatar: data.avatar,
          admin: data.admin,
          password: encript,
        };
        await this.model.create(newUser);
        logger.info("Nuevo Usuario creado Satisfactoriamente");
        const newChat ={
          rol: this.setUserType(data.admin),
          email: data.email,
          firstname: `${data.firstname} ${data.lastname}`,
        }
        await chat.createchannel(newChat)
        this.notificarAdmin(newUser);
      } catch (error) {
        logger.error(error);
        return { error: error };
      }
    }
  }

  async updateUser(user, id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "usuario no encontrado" };
      } else if (!user.firstname) {
        return { error: "este campo es obligatorio" };
      } else if (!user.lastname) {
        return { error: "este campo es obligatorio" };
      } else if (!user.age) {
        return { error: "este campo es obligatorio" };
      } else if (!user.address) {
        return { error: "este campo es obligatorio" };
      } else if (!user.phone) {
        return { error: "este campo es obligatorio" };
      } else if (!user.email) {
        return { error: "este campo es obligatorio" };
      } else if (!user.avatar) {
        return { error: "este campo es obligatorio" };
      } else if (!user.admin) {
        return { error: "este campo es obligatorio" };
      } else {
        user.id = id;
        user.timestamp = data.timestamp;
        await this.model.updateOne(
          { id: id },
          {
            $set: {
              firstname: user.firstname,
              lastname: user.lastname,
              age: user.age,
              address: user.address,
              phone: user.phone,
              email: user.email,
              avatar: user.avatar,
              admin: user.admin,
            },
          }
        );
      }
    } catch (error) {
      logger.error("error!: ", error);
      return {error: error}
    }
  }

  async deleteById(id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "el usuario no existe" };
      } else {
        await this.model.deleteOne({ id: id });
      }
    } catch (error) {
      logger.error("ERROR", error);
      return {error: error}
    }
  }

  async getHighestId() {
    const data = await this.model.find({}, { id: 1, _id: 0 });
    if (data.length == 0) {
      return 1;
    } else {
      const highest = Math.max(...data.map((o) => o.id));
      const result = highest + 1;
      return result;
    }
  }

  setUserType(user){
    if(user.admin === "true"){
      return "sistema"
    } else {
      return "usuario"
    }
  }
};
/*
  async notificarAdmin(nuevoUsuario) {
    const message = {
      asunto: "Nuevo Registro",
      mensaje: `Un nuevo usuario se ha registrado.
      datos del usuario:
      - nombre y apellido: ${nuevoUsuario.nombre} ${nuevoUsuario.apellido},
      - edad: ${nuevoUsuario.edad},
      - dirección: ${nuevoUsuario.direccion},
      - telefono: ${nuevoUsuario.telefono},
      - email: ${nuevoUsuario.email}.`,
    };
    enviarMail(message.asunto, message.mensaje, process.env.EMAIL_DESTINATION);
  }
};
*/