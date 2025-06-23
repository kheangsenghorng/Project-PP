"use client";

import React, { useEffect, useState } from "react";
import {
  FiList,
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLink,
} from "react-icons/fi";
import CategoryCreate from "@/components/create";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryStore } from "@/store/categoryStore";

function CategoryList() {
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  const {
    categories,
    error,
    createCategory,
    fetchCategories,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleSubmit = () => {
    if (!categoryName.trim()) return;

    if (editId !== null) {
      const category = categories.find((c) => c._id === editId);
      if (category) {
        const updatedData = { name: categoryName }; // or include slug if needed
        updateCategory(category.slug, updatedData);
      }
    } else {
      createCategory(categoryName);
    }

    resetForm();
  };

  const handleDelete = async (slug) => {
    try {
      await deleteCategory(slug); // Wait for the deletion to complete
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openEditPopup = (category) => {
    setCategoryName(category.name);
    setEditId(category._id);
    setPopupOpen(true);
  };

  const resetForm = () => {
    setCategoryName("");
    setEditId(null);
    setPopupOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Category</CardTitle>
          <Button onClick={() => setPopupOpen(true)}>
            <FiPlus className="mr-2" />
            Add Category
          </Button>
        </CardHeader>

        <CardContent>
          <CategoryCreate
            isOpen={popupOpen}
            onClose={resetForm}
            onSubmit={handleSubmit}
            value={categoryName}
            setValue={setCategoryName}
            isEditing={editId}
            type="Category"
          />

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FiList />
                      ID
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FiTag />
                      Name
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FiLink />
                      Slug
                    </div>
                  </TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Badge variant="outline">{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {category.slug}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditPopup(category)}
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.slug)}
                      >
                        <FiTrash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No categories found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryList;
