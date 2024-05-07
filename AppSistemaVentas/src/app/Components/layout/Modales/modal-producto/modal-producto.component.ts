import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder , FormGroup , Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formularioProdcto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];


  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadService: UtilidadService
  ) { 

    this.formularioProdcto = this.fb.group({
      nombre: ['' , Validators.required],
      idCategoria: ['' , Validators.required],
      stock: ['' , Validators.required],
      precio: ['' , Validators.required],
      esActivo: ['' , Validators.required],
    });

    if(this.datosProducto != null){

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";

    }

    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if(data.status) this.listaCategorias = data.value;
      },
      error: (err) => {}
    });
  }

  ngOnInit(): void {
    
    if(this.datosProducto != null){

      this.formularioProdcto.patchValue({

        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto(){

    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProdcto.value.nombre,
      idCategoria: this.formularioProdcto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProdcto.value.precio,
      stock: this.formularioProdcto.value.stock,
      esActivo: parseInt(this.formularioProdcto.value.esActivo)
    }

    if(this.datosProducto == null){

      this._productoServicio.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadService.mostrarAlerta("El producto fue registrado" , "Exito");
            this.modalActual.close("true");
          }
          else
            this._utilidadService.mostrarAlerta("No se pudo registrar el producto" , "Error");
        },
        error: (e) => {}
      });

    }
    else{

      this._productoServicio.editar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadService.mostrarAlerta("El producto fue editado" , "Exito");
            this.modalActual.close("true");
          }
          else
            this._utilidadService.mostrarAlerta("No se pudo editar el producto" , "Error");
        },
        error: (e) => {}
      });

    }

  }

}
