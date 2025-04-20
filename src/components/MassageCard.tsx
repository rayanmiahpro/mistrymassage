"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Massage } from "@/models/User";
import axios from "axios";
import { ApiResponce } from "@/types/ApiResponce";
import dayjs from "dayjs";

type MassageCardProps = {
  massage: Massage;
  onMassageDelete: (massageId: string) => void;
};

function MassageCard({ massage, onMassageDelete }: MassageCardProps) {
  const handaleDeleteConfirm = async () => {
    try {
      const responce = await axios.delete<ApiResponce>(
        `/api/delete-massage/${massage._id}`
      );

      onMassageDelete(massage._id);
    } catch (error) {
      console.log("error deleting massage", error);
    }
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{massage.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handaleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(massage.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default MassageCard;
