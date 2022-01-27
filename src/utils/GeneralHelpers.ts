export let generalServiceResponse = (data: any, message: string = '') => {
  if (typeof data === 'undefined' || !data || data === null) {
    return {
      status: false,
      message: message.length === 0 ? 'Error en el servicio' : message
    };
  }

  return {
    status: true,
    data,
    message:
      message.length === 0
        ? 'Operación exitosa - obtención de registros'
        : message
  };
};
