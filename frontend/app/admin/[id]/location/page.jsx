"use client";

import React, { useEffect, useState } from "react";
import {
  FiList,
  FiCalendar,
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiLink,
} from "react-icons/fi";
import LocationCreate from "@/components/create";
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
import { useLocationStore } from "@/store/useLocationStore";

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single
    .trim();
}

function LocationList() {
  const [locationName, setLocationName] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null); // object or null

  const { fetchLocations, locations, loading, updateLocation, createLocation } =
    useLocationStore();

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleSubmit = () => {
    if (!locationName.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const slug = generateSlug(locationName);

    if (editingLocation) {
      updateLocation(editingLocation.slug, {
        name: locationName,
        slug,
        createdAt: today,
      });
    } else {
      createLocation({
        name: locationName,
        slug,
        createdAt: today,
      });
    }

    resetForm();
  };

  const handleDelete = (slug) => {
    // If you have deleteLocation in the store
    useLocationStore.getState().deleteLocation(slug);
  };

  const openEditPopup = (location) => {
    setLocationName(location.name);
    setEditingLocation(location);
    setPopupOpen(true);
  };

  const resetForm = () => {
    setLocationName("");
    setEditingLocation(null);
    setPopupOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <FiMapPin className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Locations</CardTitle>
          </div>
          <Button onClick={() => setPopupOpen(true)}>
            <FiPlus className="mr-2" />
            Add Location
          </Button>
        </CardHeader>

        <CardContent>
          <LocationCreate
            isOpen={popupOpen}
            onClose={resetForm}
            onSubmit={handleSubmit}
            value={locationName}
            setValue={setLocationName}
            isEditing={!!editingLocation}
            type="Location"
          />

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : locations.length > 0 ? (
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
                {locations.map((location, index) => (
                  <TableRow key={location.slug}>
                    <TableCell>
                      <Badge variant="outline">{index + 1}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {location.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {location.slug}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditPopup(location)}
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(location.slug)}
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
              <p className="text-muted-foreground">No locations found.</p>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => setPopupOpen(true)}
              >
                <FiPlus className="mr-2" />
                Add your first location
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LocationList;
