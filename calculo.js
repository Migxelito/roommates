const recalcularDeudas = async () => {
    let { roommates } = JSON.parse(await fsPromises.readFile("data/roommates.json", "utf8"));
    const { gastos } = JSON.parse(await fsPromises.readFile("data/gastos.json", "utf8"));
  
    roommates = roommates.map((r) => {
      r.debe = 0;
      r.recibe = 0;
      r.total = 0;
      return r;
    });
  
    gastos.forEach((g) => {
      roommates = roommates.map((r) => {
        const dividendo = Number((g.monto / roommates.length).toFixed(2));
        if (g.roommate == r.nombre) {
          r.recibe += dividendo;
        } else {
          r.debe -= dividendo;
        }
        r.total = r.recibe - r.debe;
        return r;
      });
    });
    await fsPromises.writeFile("data/roommates.json", JSON.stringify({ roommates }));
  };
  